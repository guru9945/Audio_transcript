import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const localTrustedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.153.1:3000",
];

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: process.env.NODE_ENV === "production"
        ? [process.env.BETTER_AUTH_URL || "https://audiotranscript-production-ddc7.up.railway.app"]
        : localTrustedOrigins,
    emailAndPassword: {
        enabled: true,
    },
});
