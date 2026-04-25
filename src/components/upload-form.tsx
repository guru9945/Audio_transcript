"use client";

import { useState, useRef } from "react";
import { transcribeAudio } from "@/actions/transcribe";
import { UploadCloud, Loader2, FileAudio } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("audio", file);

    const result = await transcribeAudio(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-primary" />
        New Transcription
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
          Audio transcribed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-gray-500 hover:bg-input/30"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) setFile(selected);
            }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <FileAudio className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="bg-input p-3 rounded-full">
                <UploadCloud className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-300">Click to upload audio</p>
              <p className="text-xs text-gray-500">MP3, WAV, M4A up to 20MB (&lt; 1 min)</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transcribing...
            </>
          ) : (
            "Transcribe Audio"
          )}
        </button>
      </form>
    </div>
  );
}
