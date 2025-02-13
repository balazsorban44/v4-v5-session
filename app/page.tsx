"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";

function Home() {
  const { data } = useSession();
  return (
    <div>
      <button
        onClick={() => {
          signIn("github");
        }}
      >
        Sign in
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
