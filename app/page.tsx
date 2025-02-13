import { signIn, auth } from "@/auth";

export default async function Page() {
  const data = await auth();
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button>Sign in</button>
      </form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
