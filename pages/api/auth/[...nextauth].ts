import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  throw new Error("Missing env vars");
}

export default NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
});
