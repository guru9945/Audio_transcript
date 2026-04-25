import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium animate-pulse">Preparing your dashboard...</p>
      </div>
    </div>
  );
}
