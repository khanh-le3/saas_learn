import React from 'react' 
import {Button} from "@/components/ui/button"
import CompanionCard from "@/components/ui/CompanionCard"
import {Table, TableHeader, TableRow, TableCell, TableHead, TableCaption, 
    TableBody} from "@/components/ui/table"
import CompanionList from "@/components/ui/CompanionList"
import Cta from '@/components/ui/Cta'
import { recentSessions } from '@/constants'
const Page = () => {
  return (
    <div className="flex flex-col gap-4 px-4 md:px-8 lg:px-16">
      <h1 className ="text-2xl underline">
        Popular Companions
      </h1>
      <section className="home-section mb-4 justify-start gap-6">
        <CompanionCard 
        id = "123"
        name = "Companion 1"
        topic = "Topic 1"
        subject = "Subject 1"
        duration = {45}
        color = "ffda6e"
        />
        <CompanionCard 
        id = "456"
        name = "Companion 2"
        topic = "Topic 2"
        subject = "Subject 2"
        duration = {60}
        color = "a1c3d3"
        />
        <CompanionCard 
        id = "789"
        name = "Companion 3"
        topic = "Topic 3"
        subject = "Subject 3"
        duration = {30}
        color = "f7c5a0"
        />
      </section>
      <section className="home-section">
        <CompanionList 
        title = "Recent Sessions"
        companions = {recentSessions}
        classNames = "w-2/3 max-lg:w-full"/>
        <Cta />
      </section>
      
      
    </div>
  )
}

export default Page
