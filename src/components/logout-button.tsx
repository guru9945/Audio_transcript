"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-input hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
