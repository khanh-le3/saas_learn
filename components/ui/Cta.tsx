import Link from "next/link";
import Image from "next/image";
export default function Cta() {
  return (
    <section className="cta-section">
      <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
      <p className="mb-6">Sign up today and start learning with our AI-powered companions!</p>
      <Image src = "/images/cta.svg" alt="CTA Image" width={360} height={230} className="mb-6" />
      <Link href="/companions/new" className="btn-primary text-white">
        Sign Up Now
      </Link>
    </section>
  );
} 
