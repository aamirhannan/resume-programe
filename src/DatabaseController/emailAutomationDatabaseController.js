
export const fetchEmailAutomations = async (client) => {
    const { data, error } = await client
        .from('email_automations')
        .select('*');

    if (error) throw error;
    return data;
};

export const insertEmailAutomation = async (client, automationData, userId) => {
    const { data, error } = await client
        .from('email_automations')
        .insert({ ...automationData, user_id: userId })
        .select()
        .single();

    if (error) throw error;
    return data;
};
