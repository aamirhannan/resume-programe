
export const fetchGeneratedResumes = async (client) => {
    const { data, error } = await client
        .from('generated_resumes')
        .select('*');

    if (error) throw error;
    return data;
};

export const insertGeneratedResume = async (client, resumeData, userId) => {
    const { data, error } = await client
        .from('generated_resumes')
        .insert({ ...resumeData, user_id: userId })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const countGeneratedResumesInTimeFrame = async (client, userId, startTime) => {
    const { count, error } = await client
        .from('generated_resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startTime.toISOString());

    if (error) throw error;
    return count;
};
