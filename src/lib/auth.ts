import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const localTrustedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.153.1:3000",
];

const productionTrustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : undefined;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    ...(process.env.NODE_ENV !== "production" ? { trustedOrigins: localTrustedOrigins } : {}),
    ...(process.env.NODE_ENV === "production" && productionTrustedOrigins ? { trustedOrigins: productionTrustedOrigins } : {}),
    emailAndPassword: {
        enabled: true,
    },
});
