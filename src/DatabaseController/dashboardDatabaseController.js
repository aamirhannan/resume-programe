
export const fetchDashboardMetrics = async (client) => {
    // Example: Fetch counts from different tables
    // Parallel execution for efficiency
    const [emailCount, outreachCount, resumeCount] = await Promise.all([
        client.from('email_automations').select('*', { count: 'exact', head: true }),
        client.from('founder_outreaches').select('*', { count: 'exact', head: true }),
        client.from('generated_resumes').select('*', { count: 'exact', head: true })
    ]);

    return {
        emailAutomations: emailCount.count || 0,
        founderOutreaches: outreachCount.count || 0,
        generatedResumes: resumeCount.count || 0
    };
};

export const fetchDashboardRoleDistribution = async (client) => {
    // This might require a more complex query or an RPC function in Supabase
    // for now, fetching all and aggregating in code (not ideal for large datasets but works for MVP)
    const { data, error } = await client
        .from('master_resumes')
        .select('role');

    if (error) throw error;

    // Aggregation logic
    const distribution = {};
    data.forEach(item => {
        distribution[item.role] = (distribution[item.role] || 0) + 1;
    });

    return distribution;
};

export const fetchDashboardDailyVelocity = async (client) => {
    // Example: Count applications per day for the last 7 days
    // Again, simplified "fetch and aggregate" for MVP without dedicated SQL functions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await client
        .from('email_automations')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

    if (error) throw error;

    const velocity = {};
    data.forEach(item => {
        const date = item.created_at.split('T')[0];
        velocity[date] = (velocity[date] || 0) + 1;
    });

    return velocity;
};

export const fetchDashboardHeatmap = async (client) => {
    // Similar to daily velocity but maybe purely existing data points
    const { data, error } = await client
        .from('email_automations') // or a union of interactions
        .select('created_at');

    if (error) throw error;
    return data.map(d => d.created_at);
};

export const fetchDashboardRecentActivity = async (client) => {
    // Union of recent actions? Or just one table for now
    // Let's fetch recent email automations
    const { data, error } = await client
        .from('email_automations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
    if (error) throw error;
    return data;
};

export const fetchApiLogs = async (client, { type, limit = 100 }) => {
    let query = client
        .from('api_request_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (type) {
        query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};
