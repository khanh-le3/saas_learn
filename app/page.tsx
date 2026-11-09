import { Suspense } from 'react'
import CompanionCard from "@/components/ui/CompanionCard"
import CompanionList from "@/components/ui/CompanionList"
import Cta from '@/components/ui/Cta'
import { getAllCompanions, getRecentSessions} from '@/lib/actions/companion.action'
import { getSubjectColor } from '@/lib/utils'
const Page = () => {
  return (
    <div className="flex flex-col gap-4 px-4 md:px-8 lg:px-16">
      <h1 className ="text-2xl underline">
        Popular Companions
      </h1>
      <section className="home-section mb-4 justify-start gap-6">
        <Suspense fallback={<p role="status">Loading companions...</p>}>
          <PopularCompanions />
        </Suspense>

      
        
      </section>
      <section className="home-section">
        <Suspense fallback={<p role="status" className="w-2/3 max-lg:w-full">Loading recent sessions...</p>}>
          <RecentSessions />
        </Suspense>
        <Cta />
      </section>
      
      
    </div>
  )
}

export default Page

async function PopularCompanions() {
  const companions = await getAllCompanions({ limit: 3 });
  return companions.map((companion) => (
    <CompanionCard
      key={companion.id}
      {...companion}
      color={getSubjectColor(companion.subject)}
    />
  ));
}

async function RecentSessions() {
  const recentSessionsCompanions = await getRecentSessions(10);
  const companions = await getRecentSessions(10);
  return (
    <CompanionList
      title="Recent Sessions"
      companions={recentSessionsCompanions}
      classNames="w-2/3 max-lg:w-full"
    />
  );
}
