import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import * as jose from "jose";
import hkdf from "@panva/hkdf";

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const now = () => (Date.now() / 1000) | 0;
const useSecureCookies = process.env.NODE_ENV === "production"; // Technically use secure cookies when you host from https://
const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const { handlers, signIn, auth } = NextAuth({
  providers: [GitHub],
  jwt: {
    async encode(params) {
      const { token: payload, secret, maxAge, salt } = params;
      const key = await getDerivedEncryptionKey([secret].flat()[0], salt);
      return await new jose.EncryptJWT(payload)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(now() + (maxAge ?? DEFAULT_MAX_AGE))
        .setJti(crypto.randomUUID())
        .encrypt(key);
    },
    async decode(params) {
      const { token: jwt, secret, salt } = params;
      if (!jwt) return null;
      const key = await getDerivedEncryptionKey([secret].flat()[0], salt);
      const { payload } = await jose.jwtDecrypt(jwt, key, {
        clockTolerance: 15,
      });
      return payload;
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
});

async function getDerivedEncryptionKey(ikm: string | Buffer, _salt: string) {
  const salt = _salt.includes(".session-token") ? "" : _salt;
  const prefix = "NextAuth.js Generated Encryption Key";
  const info = `${prefix}${salt ? ` (${salt})` : ""}`;
  return await hkdf("sha256", ikm, salt, info, 32);
}
