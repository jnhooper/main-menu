import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { SignInButton } from "~/app/_components/SignInButton";
import { api, HydrateClient } from "~/trpc/server";
import { CreateHousehold } from "./_components/households/CreateHousehold";
export default async function Home() {
  const session = await auth();
  const myHouseholds = session?.user
    ? await api.household.getMyHouseholds()
    : [];

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
            Welcome to{"   "}
            <div className="text-[hsl(280,100%,70%)] whitespace-nowrap">
              Our Menu
            </div>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <SignInButton signedIn={!!session} />
            </div>
          </div>

          {session?.user && (
            <CreateHousehold
              initialHouseholds={myHouseholds}
            />
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
