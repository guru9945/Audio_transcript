import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const localTrustedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.153.1:3000",
];

const isProduction = process.env.NODE_ENV === "production";
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const productionBaseURL = process.env.BETTER_AUTH_URL || vercelUrl;
const productionTrustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : productionBaseURL
        ? [productionBaseURL]
        : undefined;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    ...(isProduction && productionBaseURL ? { baseURL: productionBaseURL } : {}),
    ...(isProduction && productionTrustedOrigins ? { trustedOrigins: productionTrustedOrigins } : {}),
    ...(!isProduction ? { trustedOrigins: localTrustedOrigins } : {}),
    emailAndPassword: {
        enabled: true,
    },
});
