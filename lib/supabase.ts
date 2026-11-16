import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = async () => {
    // Resolve request auth before Supabase starts its background Realtime setup.
    const { getToken } = await auth();
    const token = await getToken();

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
            async accessToken() {
            return token;
        }
  }
)
}
