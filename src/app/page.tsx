"use client";

import React, { useState } from "react";
import Dropzone from "@/components/Dropzone";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import CircularProgress from "@/components/CircularProgress";
import Pill from "@/components/Pill";
import Card from "@/components/Card";
import { Sparkles, AlertCircle, Compass, Rocket } from "lucide-react";

interface AnalyzeResponse {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  upskillRoadmap: string;
  projectIdea: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError("Please provide both a resume (PDF) and a job description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze fit.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Analyze Fit
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your resume and paste the job description to see how well you match the role.
        </p>
      </header>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mb-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 rounded-3xl bg-sidebar border border-border shadow-sm flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col items-center gap-4 relative z-10">
              <h2 className="text-lg font-semibold text-muted-foreground">Match Score</h2>
              <CircularProgress value={result.matchScore} size={160} />
            </div>

            <div className="flex-1 w-full flex flex-col gap-8 relative z-10">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-foreground">Matching Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills.length > 0 ? (
                    result.matchingSkills.map((skill, idx) => (
                      <Pill key={idx} type="match" label={skill} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No matching skills found.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-foreground">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill, idx) => (
                      <Pill key={idx} type="missing" label={skill} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No missing skills found. Great fit!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card title="Upskill Roadmap" icon={<Compass size={24} />}>
              <p>{result.upskillRoadmap}</p>
            </Card>
            <Card title="Project Idea" icon={<Rocket size={24} />}>
              <p>{result.projectIdea}</p>
            </Card>
          </div>
        </div>
      )}

      {!result && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="flex flex-col gap-6 p-6 rounded-2xl bg-sidebar border border-border shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                Your Resume
              </h2>
              <Dropzone file={file} onFileChange={setFile} />
            </section>

            <section className="flex flex-col gap-6 p-6 rounded-2xl bg-sidebar border border-border shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                Job Description
              </h2>
              <TextArea 
                label="Paste the job requirements here"
                placeholder="e.g. We are looking for a software engineer with 5 years of experience in React and Node.js..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </section>
          </div>

          <div className="mt-10 flex justify-end border-t border-border pt-6">
            <Button 
              size="lg" 
              leftIcon={!isLoading && <Sparkles size={18} />}
              isLoading={isLoading}
              onClick={handleAnalyze}
              disabled={!file || !jobDescription}
            >
              {isLoading ? "Analyzing..." : "Analyze Fit"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
