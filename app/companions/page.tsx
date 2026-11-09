import { Suspense } from 'react'
import { getAllCompanions } from '@/lib/actions/companion.action'
import CompanionCard from '@/components/ui/CompanionCard';
import { getSubjectColor } from '@/lib/utils';
import SearchInput from '@/components/ui/Searchinput';
import SubjectFilter from '@/components/ui/SubjectFilter';
import React from 'react';

const CompanionLibrary = ({ searchParams }: SearchParams) => {
    return(
        <main>
            <section className = "flex justify between gap-4 max-sm:flex-col">
                <h1>
                    Companion Library
                </h1>
                <div className = "flex gap-4">
                    <Suspense fallback={<p role="status">Loading search...</p>}>
                        <SearchInput/>
                        <SubjectFilter/>
                    </Suspense>
                </div>
            </section>
            <Suspense fallback={<p role="status">Loading companions...</p>}>
                <CompanionResults searchParams={searchParams} />
            </Suspense>
        </main>
    )
}

async function CompanionResults({ searchParams }: SearchParams) {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';
    const companions = await getAllCompanions({ subject, topic });

    return (
        <section className="companions-grid">
            {companions.map((companion) => (
                <CompanionCard key={companion.id} {...companion}
                color = {getSubjectColor(companion.subject)} />
            ))}
        </section>
    );
}

export default CompanionLibrary
