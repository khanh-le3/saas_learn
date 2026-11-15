import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Favorite() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    return (
        <div>
            <h1>Favorite</h1>
        </div>
    )
}