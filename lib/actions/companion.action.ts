'use server'
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export const createCompanion = async (formData: CreateCompanion) => {
    const  { userId: author   } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("companions").insert({
        ...formData,
        author
    }).select();

    if (error||!data) {
        throw new Error(error?.message || "Failed to create companion");
    }

    return data[0]; 
}

export const getAllCompanions = async ({limit = 10, page =1, subject, topic}: GetAllCompanions ) => {
    const { userId } = await auth();
    if (!userId) return [];
    const supabase = createSupabaseClient();
    let query = supabase.from("companions").select().eq('author', userId);
    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);
    const { data: companions, error } = await query;
    if (error) {
        throw new Error(error.message);
    }
    return companions;
}

export const getCompanion = async(id: string) => {
    const supabase = createSupabaseClient();
    const {data, error} = await supabase
                                .from('companions')
                                .select()
                                .eq('id', id)
                                .maybeSingle();
    if (error) throw new Error(error.message);

    return data;


}

export const addToSessionHistory = async (companionId: string) => {
    if (!companionId) throw new Error('A companion ID is required to save session history.');
    const { userId } = await auth();
    if (!userId) throw new Error('Sign in to save session history.');
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.from('SessionHistory').insert({
        companion_id: companionId,
        user_id: userId
    })

    if (error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit =10) => {
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.from('SessionHistory')
    .select(`companions:companion_id(*)`)
    .order('created_at', { ascending: false }).limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({companions}) => companions).filter(companion => companion != null);
}

export const getUserSessions = async (userId: string, limit =10) => {
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.from('SessionHistory')
    .select(`companions:companion_id(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(limit);

    if (error) throw new Error(error.message);

    return data.map(({companions}) => companions).filter(companion => companion != null);
}

export const getUserCompanions= async (userId: string) => {
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.from('companions')
    .select()
    .eq('author', userId)

    if (error) throw new Error(error.message);

    return data;
}

export const newCompanionPermission = async () => {
    const {userId, has} = await auth();
    const supabase = createSupabaseClient();
    let limit = 10;

    if (has({plan: 'Premium'})) {
        return true;
    } else if(has({ feature: '3_companions'})) {
        limit = 3;
    } else if(has({ feature: '10_companions'})) {
        limit = 10;
    }
  
    const {data, error} = await supabase.from('companions')
    .select('id', { count: 'exact' })
    .eq('author', userId)
    
    if (error) throw new Error(error.message);
    
    const companionCount = data?.length;

    if(companionCount >=  limit) {
        return false
    } else {
        return true;
    }
    
}
