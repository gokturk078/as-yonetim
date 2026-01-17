import { NextResponse } from "next/server";
import { getFileContent } from "@/lib/github-api";
import { decryptData } from "@/lib/crypto";
import { signToken } from "@/lib/auth";
import CryptoJS from "crypto-js";

import { updateFileContent } from "@/lib/github-api";
import { encryptData } from "@/lib/crypto";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Fetch credentials.json from GitHub
        const { content, sha } = await getFileContent("data/credentials.json");

        // FIRST RUN INITIALIZATION
        if (!content) {
            if (email === "ferit@abi.com" && password === "admin123") {
                // Create initial admin user
                const initialUser = {
                    email: "ferit@abi.com",
                    passwordHash: CryptoJS.SHA256("admin123").toString(),
                    role: "admin",
                    name: "Ferit Abi"
                };

                const encryptedContent = { data: encryptData([initialUser]) };

                // Create the file on GitHub
                await updateFileContent(
                    "data/credentials.json",
                    encryptedContent,
                    null, // No SHA means create new file
                    "🚀 System Link: Initial credentials setup"
                );

                const token = await signToken({ email, role: "admin", name: "Ferit Abi" });
                const response = NextResponse.json({ success: true, message: "System initialized" });
                response.cookies.set("f2s_token", token, { httpOnly: true, maxAge: 8 * 60 * 60, path: "/" });
                return response;
            }
            return NextResponse.json({ error: "System not initialized. Use default credentials." }, { status: 401 });
        }

        // 2. Decrypt and find user
        const users = decryptData(content.data);
        if (!Array.isArray(users)) {
            return NextResponse.json({ error: "Invalid credentials file" }, { status: 500 });
        }

        const user = users.find((u: any) => u.email === email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        // 3. Verify Password
        const inputHash = CryptoJS.SHA256(password).toString();
        if (inputHash !== user.passwordHash) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // 4. Sign Token
        const token = await signToken({ email: user.email, role: user.role, name: user.name });

        // 5. Set Cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set("f2s_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 8 * 60 * 60, // 8 hours
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
