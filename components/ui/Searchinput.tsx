'use client'
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formUrlQuery } from "@jsmastery/utils";
import { removeKeysFromUrlQuery } from "@jsmastery/utils";

export default function SearchInput() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const[searchQuery, setSearchQuery] = React.useState(() => searchParams.get("topic") || "");

    useEffect(() => {
        if ((searchParams.get("topic") || "") === searchQuery) return;
        const delayDebounceFn = setTimeout(() => {
            if(searchQuery) {
                const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "topic",
                value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else{
                if (pathname === "/companions") {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            } 
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, router, pathname, searchParams]);
    
    
    return (
        <div className = "relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
            <Image src = "/icons/search.svg" alt = "search" width={15} height={15}/>
            <input
                placeholder="Search companions"
                className = "w-full"
                value = {searchQuery}
                onChange = {(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
