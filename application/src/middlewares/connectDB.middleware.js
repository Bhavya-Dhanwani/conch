import { connectDB } from "@/config/db.config";

export async function middleware(req) {
    await connectDB();
}

export const config = {
    matcher: "/api/:path*"
}   