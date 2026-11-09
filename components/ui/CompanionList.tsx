import { Button } from "@/components/ui/button"
import CompanionCard from "@/components/ui/CompanionCard"
import {Table, TableHeader, TableRow, TableCell, TableHead, TableCaption, 
    TableBody} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { getSubjectColor } from "@/lib/utils"



interface CompanionListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}

export default function CompanionList({ title, companions, classNames }: CompanionListProps) {
  return (  
    <article className={cn('companion-list', classNames)}>
        <h2>
            {title}
        </h2>
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-lg w-2/3">Lessons</TableHead>
                    <TableHead className="text-lg">Status</TableHead> 
                    <TableHead className="text-right">Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companions?.map(({id, subject, name, topic, duration}) => (
                    <TableRow key={id}>
                        <TableCell>
                            <Link href={`/companions/${id}`} className="flex items-center gap-2">
                                <div className ="flex items-center gap-2">
                                    <div className="size - [72px]flex items-center justify-center
                                        rounded-lg max-md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                                        <Image 
                                        src={`/icons/${subject}.svg`}
                                        alt={subject}
                                        width={35}
                                        height={35}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-bold text-2xl">{name}</p>
                                        <p className="text=lg">{topic}</p>
                                    </div>
                            </div>
                        </Link>
                    </TableCell>  
                    <TableCell>
                        <div className="subject-badge w-fit max-md:hidden">
                            {subject}
                        </div>
                        <div className = "flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                            <Image 
                            src={`/icons/${subject}.svg`}
                            alt={subject}
                            width={18}
                            height={18}
                            />
                        </div>
                    </TableCell>   
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <p className="text-xl">{duration} 
                                <span className="max-md:hidden">mins</span>
                            </p>
                            <Image 
                                src="/icons/clock.svg"
                                alt="mins"
                                width={14}
                                height={14}
                                className="max-md:hidden"
                            />
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
         </Table>
            
    </article>
    )
}
