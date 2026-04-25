"use client";

import { FileText, CalendarDays } from "lucide-react";

type Transcript = {
  id: string;
  text: string;
  createdAt: Date;
};

export default function TranscriptList({ transcripts }: { transcripts: Transcript[] }) {
  if (transcripts.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center shadow-lg h-full flex flex-col items-center justify-center">
        <div className="bg-input p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No transcripts yet</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          Upload an audio file using the form on the left to generate your first transcription.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Recent Transcripts
      </h2>
      <div className="grid gap-4">
        {transcripts.map((t) => (
          <div key={t.id} className="rounded-2xl bg-card border border-border p-6 shadow-md hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <CalendarDays className="h-3 w-3" />
              {new Date(t.createdAt).toLocaleString()}
            </div>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {t.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
