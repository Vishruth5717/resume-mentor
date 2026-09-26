import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment");
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const formData = await request.formData();
    
    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume and job description are required." },
        { status: 400 }
      );
    }

    console.log("Starting PDF extraction with unpdf...");
    const { getDocumentProxy, extractText } = require('unpdf');
    
    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    
    const resumeText = text;
    console.log("PDF extraction successful. Extracted length:", resumeText.length);

    console.log("Preparing Gemini prompt...");
    const prompt = `
You are an expert technical recruiter and career coach.
I am providing you with a candidate's resume text and a job description.
Analyze the fit between the candidate and the role.

Return ONLY a raw JSON object (no markdown formatting, no \`\`\`json block) with the following exact schema:
{
  "matchScore": number, // A percentage score from 0 to 100 representing how well they match
  "matchingSkills": string[], // A list of skills the candidate has that match the job
  "missingSkills": string[], // A list of important skills from the job description the candidate lacks
  "upskillRoadmap": string, // A short, actionable paragraph on how they can bridge the gap
  "projectIdea": string // A specific, impressive project idea they could build to prove they have the missing skills
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
    `;

    console.log("Calling Gemini API...");
    const MAX_RETRIES = 3;
    let response;
    let attempt = 0;
    let success = false;
    
    while (attempt < MAX_RETRIES && !success) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        success = true;
      } catch (error: any) {
        attempt++;
        console.error(`Gemini API attempt ${attempt} failed:`, error.message);
        if (attempt >= MAX_RETRIES) {
          throw new Error(`Failed to call Gemini API after ${MAX_RETRIES} attempts: ${error.message}`);
        }
        // Exponential backoff delay: 1s, 2s
        const delayMs = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${delayMs}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    console.log("Received response from Gemini API.");
    let rawJson = response!.text;
    
    if (!rawJson) {
      throw new Error("Received empty response from Gemini");
    }

    // Cleanly parse JSON, handling potential markdown blocks
    rawJson = rawJson.trim();
    if (rawJson.startsWith("```json")) {
      rawJson = rawJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawJson.startsWith("```")) {
      rawJson = rawJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Parse it just to make sure it's valid JSON before sending it to the client
    const jsonResult = JSON.parse(rawJson);
    console.log("Successfully parsed Gemini JSON response.");

    return NextResponse.json(jsonResult);
    
  } catch (error: any) {
    console.error("Error analyzing fit:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process the request." },
      { status: 500 }
    );
  }
}
