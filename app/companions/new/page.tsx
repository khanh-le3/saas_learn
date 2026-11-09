import { Suspense } from "react";
import CompanionForm from "@/components/ui/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { newCompanionPermission } from "@/lib/actions/companion.action";
import Image from "next/image";
import Link from "next/link";

export default function NewCompanion() {
  return (
    <Suspense fallback={<p role="status">Loading companion builder…</p>}>
      <AuthenticatedCompanionBuilder />
    </Suspense>
  );
}

async function AuthenticatedCompanionBuilder() {
  const { userId } = await auth();
  if(!userId) redirect("/sign-in");

  const canCreateCompanion = await newCompanionPermission();
  return ( 
    <main className = "min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
      {canCreateCompanion ? ( 
        <article className = "w-full gap-4 flex flex-col">
        <h1>
          Companion Builder
        </h1>
        <CompanionForm />
      </article>
      ) : (
        <article>
          <Image src="/images/limit.svg" 
          alt="Companion limit reached" width={360} height={230} />
          <div className = "cta-badge"> Upgrade your plan</div>
          <p> 
             You have reached the maximum number of companions you can create. Upgrade your plan to create more.
          </p>
          <Link href="/subscription" className = "btn-primary w-full justify-center">
            Upgrade
          </Link>
        </article>
      )}
    </main>
  );
}
