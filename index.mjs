import * as jose from "jose";
import { hkdf } from "@panva/hkdf";

const params = {
  jwt: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..zdPqc5jr_3Ph4Czn.oYMH4h4RMRS6KIXctQE1ycNp7bUJtBWX4jMtjKbZlG2Sn4nwvyIoX5dbmAKvt1itQ9HuIw1KXN7HiYgMp6gu_upfaj9gvHKxjn4qVRHe4W-h9DwXCfxuLmOnSKiHC509-FTD9SeaQA8QS5SzereWzpM0wmGFEVfiyVRW6_gE6cBq95RN9T2eYMpr7g2jrClt2eh5IeJUZQtYCJ2Cb6h55RMYm7SeuId73_K4oamTOm55tnADNqMa2TsAgIO_Mlsmepb4z6fI1MzwkG3RryeJSWJMJrNQBT8QMQ.mJ22DfSGUhosbkiA4dTliw",
  secret: "x3j8l7FBMNyhg0FAKEdT/0Fh2caD4IAnwr5AmohToRI=",
  salt: "authjs.session-token",
};

if (params.salt.endsWith("authjs.session-token")) params.salt = "";
params.salt = params.salt.replace("authjs.", "next-auth.");

async function getDerivedEncryptionKey(ikm, salt) {
  const info = `NextAuth.js Generated Encryption Key${
    salt ? ` (${salt})` : ""
  }`;
  return await hkdf("sha256", ikm, salt, info, 32);
}
const key = await getDerivedEncryptionKey(
  [params.secret].flat()[0],
  params.salt
);

const { payload } = await jose.jwtDecrypt(params.jwt, key, {
  clockTolerance: 15,
});

console.log(payload);
