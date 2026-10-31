import Link from "next/link";
import Image from "next/image";
import NavItems from "./navItems";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">
            <Image
            src="public\images\logo.svg"
            
            alt="Logo"
            width={50}
            height={50}
            />
          <span className="text-xl font-bold">My App</span>
        </div>
      </Link>
        <div className="flex items-center gap-4">
            <NavItems />
            <p>Sign In</p>
        </div>
            
        


    </nav>
  );
}
