'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { handleBookmark } from "@/lib/actions/companion.action";
interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}



export default function CompanionCard({ id, name, topic, subject, duration, color, bookmarked }: CompanionCardProps) {
  const [isbookmark, setBookmark] = useState(bookmarked ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const toggleBookmark =async  () => {
    if (isSaving) return;
    setIsSaving(true);
    setBookmark(!isbookmark);
    try {
      const updated = await handleBookmark(id, !isbookmark);
      setBookmark(updated.bookmarked);
    } catch(error) {
      setBookmark(isbookmark);
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <article className="companion-card" style={{ backgroundColor: color.startsWith("#") ? color : `#${color}` }}>
      <div className = "flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button type="button" className="companion-bookmark" onClick={toggleBookmark}
          disabled={isSaving}
          aria-pressed={isbookmark} aria-label={isbookmark ? "Remove bookmark" : "Add bookmark"}>
          <Image src = {isbookmark? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"} alt="Bookmark" 
            width={24} height={24} />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image src="/icons/clock.svg" alt="Clock" width={16} height={16} />
        <p className="text-sm">{duration} mins</p>
      </div>
      <Link href={`/companions/${id}`} className="w-fulll">
        <button className="btn-primary w-full justify-center">
          Launch Lesson</button>
      </Link>
    </article>
  );
} 
