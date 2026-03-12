"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: { error: string }, formData: FormData) {
    const password = formData.get("password");

    if (password === process.env.ADMIN_PASSWORD || password === "importsadmin") {
        const cookieStore = await cookies();
        cookieStore.set("admin_auth", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        redirect("/admin/dashboard");
    } else {
        return { error: "Senha incorreta" };
    }
}
