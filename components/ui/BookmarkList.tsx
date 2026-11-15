/*
'use client'
import { useContext } from "react";
import { CompanionContext } from "@/contexts/CompanionContext";

export default function BookmarkList() {
    const {bookmarkedCompanions} = useContext(CompanionContext);
    return (
        <div>
            <h1>Bookmark List</h1>
            {bookmarkedCompanions.map((companion) => (
                <div key={companion.id}>
                    <h2>{companion.name}</h2>
                    <p>{companion.topic}</p>
                    <p>{companion.subject}</p>
                    <p>{companion.duration}</p>
                </div>
            ))}
        </div>
    )
}
    */