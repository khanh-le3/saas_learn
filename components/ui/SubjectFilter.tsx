'use client';
import Image from "next/image";
import React from "react";
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from "./select";
import { subjects } from "@/constants";


export default function SubjectFilter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const[filterQuery, setFilterQuery] = React.useState(() => searchParams.get("subject") || "");

    useEffect(() => {
            if ((searchParams.get("subject") || "") === filterQuery) return;
            const delayDebounceFn = setTimeout(() => {
            if(filterQuery) {
                const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: filterQuery,
                
                });
                router.push(newUrl, { scroll: false });
            } else{ 
                if (pathname === "/companions") {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["subject"],
                    });
                    router.push(newUrl, { scroll: false });
                }
            }
            }, 500);
            return () => clearTimeout(delayDebounceFn);
    }, [filterQuery, router, pathname, searchParams]);

    return (
                <Select 
                    value={filterQuery||"all"} 
                    onValueChange={(value) => setFilterQuery(value === "all" ? "" : (value ?? ""))}>
                    <SelectTrigger className="input capitalize">
                        <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value = "all">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                            <SelectItem key = {subject} value = {subject} 
                            className = "capitalize">               
                                    {subject}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
        )
}