import Link from "next/link";
import Image from "next/image";
import NavItems from "./navItems";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
            <Image
            src="/images/logo.svg"
            
            alt="Logo"
            width={50}
            height={50}
            />
          <span className="text-xl font-bold">My App</span>
        </div>
      </Link>
        <div className="flex items-center gap-4">
            <Suspense fallback={<span className="text-sm" role="status">Loading navigation...</span>}>
              <NavItems />
            </Suspense>
            <Suspense fallback={<span className="text-sm">Loading account…</span>}>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button type="button" className="cursor-pointer">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button type="button" className="btn-primary">Sign Up</button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </Suspense>
        </div>
            
        


    </nav>
  );
}
