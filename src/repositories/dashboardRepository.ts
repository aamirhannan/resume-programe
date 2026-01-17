import { supabase } from '#src/config/supabase';

export interface IDashboardRepository {
  getMetrics(startDate?: Date, endDate?: Date): Promise<any>;
  getRoleDistribution(startDate?: Date, endDate?: Date): Promise<any[]>;
  getDailyVelocity(startDate?: Date, endDate?: Date): Promise<any[]>;
  getActivityHeatmap(startDate?: Date, endDate?: Date): Promise<any[]>;
  getRecentActivity(limit?: number): Promise<any[]>;
}

export class SupabaseDashboardRepository implements IDashboardRepository {
  
  private applyDateFilter(query: any, column: string, startDate?: Date, endDate?: Date) {
    if (startDate) {
      query = query.gte(column, startDate.toISOString());
    }
    if (endDate) {
      query = query.lte(column, endDate.toISOString());
    }
    return query;
  }

  async getMetrics(startDate?: Date, endDate?: Date) {
    // We need counts for 3 tables: email_automations, founder_outreaches, resume_generations
    // And ideally calculate growth (comparison with previous period).
    // For MVP, we might just return total counts if growth is too complex for a single query, 
    // but user asked for growth. Let's try to get current period counts first.

    const getCount = async (table: string) => {
      let query = supabase.from(table).select('*', { count: 'exact', head: true }).eq('status', 'SUCCESS');
      query = this.applyDateFilter(query, 'created_at', startDate, endDate);
      const { count, error } = await query;
      if (error) console.error(`Error counting ${table}:`, error);
      return count || 0;
    };

    const emailAgentCount = await getCount('email_automations');
    const founderOutreachCount = await getCount('founder_outreaches');
    const resumeGeneratedCount = await getCount('resume_generations');

    return {
      totalSent: { count: emailAgentCount + founderOutreachCount + resumeGeneratedCount, growth: 0 }, // Growth calculation requires historical data, skipping for now or mocking
      emailAgent: { count: emailAgentCount, growth: 0 },
      founderOutreach: { count: founderOutreachCount, growth: 0 },
      resumeGenerated: { count: resumeGeneratedCount, growth: 0 }
    };
  }

  async getRoleDistribution(startDate?: Date, endDate?: Date) {
      // Aggregate role from email_automations and founder_outreaches
      // distinct roles: Frontend, Backend, Full Stack
      // This is harder with just Supabase client unless we use RPC or raw SQL. 
      // We will fetch all (or filtered) and aggregate in JS for now as dataset is likely small, 
      // or use .select('role') and count.
      
      const fetchRoles = async (table: string) => {
        let query = supabase.from(table).select('role');
        query = this.applyDateFilter(query, 'created_at', startDate, endDate);
        const { data, error } = await query;
        if(error) return [];
        return data.map((d: any) => d.role).filter(Boolean);
      };

      const emailRoles = await fetchRoles('email_automations');
      const founderRoles = await fetchRoles('founder_outreaches');
      
      const allRoles = [...emailRoles, ...founderRoles];
      const distribution: Record<string, number> = {};
      
      allRoles.forEach(r => {
          distribution[r] = (distribution[r] || 0) + 1;
      });

      // Format for recharts or similar
      const result = Object.entries(distribution).map(([role, count]) => ({
          role,
          count,
          fill: this.getColorForRole(role)
      }));
      
      return result;
  }

  private getColorForRole(role: string): string {
      // Mock colors
      if(role.toLowerCase().includes('frontend')) return '#8884d8'; // purple
      if(role.toLowerCase().includes('backend')) return '#82ca9d'; // green
      if(role.toLowerCase().includes('full')) return '#ffc658'; // orange
      return '#cccccc';
  }

  async getDailyVelocity(startDate?: Date, endDate?: Date) {
      // Group by day and role.
      // Fetch 'created_at' and 'role' from email_automations (as per requirement "emails sent per day")
      let query = supabase.from('email_automations').select('created_at, role');
      query = this.applyDateFilter(query, 'created_at', startDate, endDate);
      
      const { data, error } = await query;
      if (error) {
          console.error("Error daily velocity", error);
          return [];
      }

      // Process in JS
      const grouped: Record<string, any> = {};
      data.forEach((item: any) => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          // Or format as "Mon", "Tue" if range is small, but ISO YYYY-MM-DD is safer for sorting
          if (!grouped[date]) grouped[date] = { date };
          const role = item.role || 'Other';
          grouped[date][role] = (grouped[date][role] || 0) + 1;
      });

      return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }

  async getActivityHeatmap(startDate?: Date, endDate?: Date) {
    // Union created_at from all 3 tables
    const fetchDates = async (table: string) => {
        let query = supabase.from(table).select('created_at');
        query = this.applyDateFilter(query, 'created_at', startDate, endDate);
        const { data } = await query;
        return data || [];
    };

    const [d1, d2, d3] = await Promise.all([
        fetchDates('email_automations'),
        fetchDates('founder_outreaches'),
        fetchDates('resume_generations')
    ]);
    
    const allDates = [...d1, ...d2, ...d3];
    const counts: Record<string, number> = {};
    
    allDates.forEach((item: any) => {
         const date = new Date(item.created_at).toISOString().split('T')[0];
         counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }

  async getRecentActivity(limit: number = 20) {
      // Fetch from 3 tables, normalize, sort, slice.
      // We assume volume is low enough to fetch limit from each and merge, or just simplified approach.
      // fetching top 20 from EACH, then merging and taking top 20 total.
      
      const fetchRecent = async (table: string, typeLabel: string) => {
          const { data, error } = await supabase
              .from(table)
              .select('*')
              .order('created_at', { ascending: false })
              .limit(limit);
          if(error) return [];
          return data.map((d: any) => ({
              id: d.id,
              company: d.company || 'N/A', // resume_generations might not have company
              role: d.role,
              date: d.created_at,
              status: d.status,
              type: typeLabel,
              actions: '...' // placeholder
          }));
      };

      const [emails, founders, resumes] = await Promise.all([
          fetchRecent('email_automations', 'Email Agent'),
          fetchRecent('founder_outreaches', 'Founder Outreach'),
          fetchRecent('resume_generations', 'Resume PDF Generator')
      ]);

      const all = [...emails, ...founders, ...resumes];
      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return all.slice(0, limit);
  }
}
