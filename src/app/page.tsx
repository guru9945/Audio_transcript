import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UploadForm from "@/components/upload-form";
import TranscriptList from "@/components/transcript-list";
import { Mic2 } from "lucide-react";
import LogoutButton from "@/components/logout-button";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const transcripts = await prisma.transcript.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8 md:mb-12 bg-card/80 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-border shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-xl border border-primary/30 hidden sm:block">
            <Mic2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-xs md:text-sm text-gray-400">Welcome, {session.user.name || session.user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <UploadForm />
          </div>
        </div>
        <div className="md:col-span-2">
          <TranscriptList transcripts={transcripts} />
        </div>
      </div>
    </div>
  );
}
