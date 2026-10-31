'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "My Journey", href: "/my-journey" },
  { label: "Companions", href: "/companions" },
  { label: "Subscription", href: "/subscription" },
];

export default function NavItems() {
    const pathname = usePathname();

    return (
        <nav className="flex space-x-4">
            {navItems.map(({ label, href }) => (
                <Link 
                href={href} 
                key={label} 
                className={cn(pathname === href ? "text-blue-500" : "text-gray-700", "hover:text-blue-500")}>
                    {label}
                </Link>
            ))}
        </nav>
    )
}