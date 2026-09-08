"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`p-4 flex justify-between items-center
        ${
          isHomePage
            ? "bg-purple-100"
            : "bg-white border-b border-purple-500 shadow-sm"
        }`}
    >
      <Link href="/" className="flex items-center">
        <Shield className="size-6 text-purple-600 mr-2" />
        <h1 className="text-xl text-purple-600 font-semibold">Expensio</h1>
      </Link>

      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/receipts">
            <Button variant="outline" className="text-purple-500">
              My Receipts
            </Button>
          </Link>
          <Link href="/manage-plan">
            <Button variant="default">Manage Plan</Button>
          </Link>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
