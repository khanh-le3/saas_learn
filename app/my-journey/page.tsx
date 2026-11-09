import { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.action";
import Image from "next/image";
import CompanionList from "@/components/ui/CompanionList";

export default function MyJourneyPage() {
    return (
        <Suspense fallback={<main><p role="status">Loading your journey...</p></main>}>
            <Profile />
        </Suspense>
    );
}

async function Profile() {
    const user = await currentUser();
    if(!user) redirect("/sign-in");

    const companions = await getUserCompanions(user.id);
    const sessionHistory = await getUserSessions(user.id);
    return (
        <main className = "min-lg:w-3/4">
            <section className = "flex jsutify between items-center gap-4 max-sm:flex-col">
                <div className="flex gap-4 items-center">
                    <Image src={user.imageUrl} 
                    alt={user.firstName!} width={100} height={100}/>
                    <div>
                        <h1 className = "flex flex-col gap-2">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {user.emailAddresses[0].emailAddress }
                        </p>
                    </div> 

                    <div className = "flex gap-4">
                        <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit"> 
                            <div className="flex items-center gap-2"> 
                                <Image src="/icons/check.svg" alt="checkmark" 
                                width={22} height={22}/>
                                <p className="text-2xl font-bold">
                                    {sessionHistory.length}
                                </p>
                            </div>
                        

                            <div>
                                Lession completed
                            </div>
                        </div>

                        <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit"> 
                            <div className="flex items-center gap-2"> 
                                <Image src="/icons/cap.svg" alt="cap" 
                                width={22} height={22}/>
                                <p className="text-2xl font-bold">
                                    {companions.length}
                                </p>
                            </div>
                        

                            <div>
                                Companions created
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>

            <Accordion defaultValue={["item-1"]}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className = "text-2xl font-bold">
                        Recent Sessions?</AccordionTrigger>
                    <AccordionContent>
                        <CompanionList title = "Recent Sessions" companions = {sessionHistory}/>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="companions">
                    <AccordionTrigger className = "text-2xl font-bold">
                        My Companions {`(${companions.length})`}</AccordionTrigger>
                    <AccordionContent>
                        <CompanionList title = "My Companions" companions = {companions}/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>

        
    )
}
