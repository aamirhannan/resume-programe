import { SupabaseClient } from '@supabase/supabase-js';

export interface IDashboardRepository {
  getMetrics(client: SupabaseClient, startDate?: Date, endDate?: Date): Promise<any>;
  getRoleDistribution(client: SupabaseClient, startDate?: Date, endDate?: Date): Promise<any[]>;
  getDailyVelocity(client: SupabaseClient, startDate?: Date, endDate?: Date): Promise<any[]>;
  getActivityHeatmap(client: SupabaseClient, startDate?: Date, endDate?: Date): Promise<any[]>;
  getRecentActivity(client: SupabaseClient, limit?: number): Promise<any[]>;
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

  async getMetrics(client: SupabaseClient, startDate?: Date, endDate?: Date) {
    // Uses RLS: The client is already scoped to the user.
    const getCount = async (table: string) => {
      let query = client.from(table).select('*', { count: 'exact', head: true }).eq('status', 'SUCCESS');
      query = this.applyDateFilter(query, 'created_at', startDate, endDate);
      const { count, error } = await query;
      if (error) console.error(`Error counting ${table}:`, error);
      return count || 0;
    };

    const emailAgentCount = await getCount('email_automations');
    const founderOutreachCount = await getCount('founder_outreaches');
    const resumeGeneratedCount = await getCount('resume_generations');

    return {
      totalSent: { count: emailAgentCount + founderOutreachCount + resumeGeneratedCount, growth: 0 },
      emailAgent: { count: emailAgentCount, growth: 0 },
      founderOutreach: { count: founderOutreachCount, growth: 0 },
      resumeGenerated: { count: resumeGeneratedCount, growth: 0 }
    };
  }

  async getRoleDistribution(client: SupabaseClient, startDate?: Date, endDate?: Date) {
      const fetchRoles = async (table: string) => {
        let query = client.from(table).select('role');
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

      const result = Object.entries(distribution).map(([role, count]) => ({
          role,
          count,
          fill: this.getColorForRole(role)
      }));
      
      return result;
  }

  private getColorForRole(role: string): string {
      if(role.toLowerCase().includes('frontend')) return '#8884d8';
      if(role.toLowerCase().includes('backend')) return '#82ca9d';
      if(role.toLowerCase().includes('full')) return '#ffc658';
      return '#cccccc';
  }

  async getDailyVelocity(client: SupabaseClient, startDate?: Date, endDate?: Date) {
      let query = client.from('email_automations').select('created_at, role');
      query = this.applyDateFilter(query, 'created_at', startDate, endDate);
      
      const { data, error } = await query;
      if (error) {
          console.error("Error daily velocity", error);
          return [];
      }

      const grouped: Record<string, any> = {};
      data.forEach((item: any) => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          if (!grouped[date]) grouped[date] = { date };
          const role = item.role || 'Other';
          grouped[date][role] = (grouped[date][role] || 0) + 1;
      });

      return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }

  async getActivityHeatmap(client: SupabaseClient, startDate?: Date, endDate?: Date) {
    const fetchDates = async (table: string) => {
        let query = client.from(table).select('created_at');
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

  async getRecentActivity(client: SupabaseClient, limit: number = 20) {
      const fetchRecent = async (table: string, typeLabel: string) => {
          const { data, error } = await client
              .from(table)
              .select('*')
              .order('created_at', { ascending: false })
              .limit(limit);
          if(error) return [];
          return data.map((d: any) => ({
              id: d.id,
              company: d.company || 'N/A',
              role: d.role,
              date: d.created_at,
              status: d.status,
              type: typeLabel,
              actions: '...'
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
