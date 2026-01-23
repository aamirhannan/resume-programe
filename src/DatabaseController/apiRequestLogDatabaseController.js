
export const fetchApiRequestLogs = async (client) => {
    const { data, error } = await client
        .from('api_request_logs')
        .select('*');

    if (error) throw error;
    return data;
};

