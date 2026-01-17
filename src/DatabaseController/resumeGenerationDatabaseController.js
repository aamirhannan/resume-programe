
export const fetchResumeGenerations = async (client) => {
    const { data, error } = await client
        .from('resume_generations')
        .select('*');

    if (error) throw error;
    return data;
};

export const insertResumeGeneration = async (client, generationData, userId) => {
    const { data, error } = await client
        .from('resume_generations')
        .insert({ ...generationData, user_id: userId })
        .select()
        .single();

    if (error) throw error;
    return data;
};
