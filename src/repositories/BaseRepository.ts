
import { supabase } from '../config/supabase.js';
import { PostgrestError } from '@supabase/supabase-js';

export abstract class BaseRepository<T> {
    protected abstract tableName: string;

    /**
     * Create a new record
     * @param data Partial data to insert
     */
    async create(data: Partial<T>): Promise<T> {
        // @ts-ignore - Supabase types can be tricky with generics, casting to any for insert payload
        const { data: inserted, error } = await supabase
            .from(this.tableName)
            .insert(data as any)
            .select()
            .single();

        if (error) {
            this.handleError(error, 'create');
        }

        return inserted as T;
    }

    /**
     * Find a record by its ID columns(s)
     * For UUIDs usually
     */
    async findById(id: string, column: string = 'id'): Promise<T | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq(column, id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            this.handleError(error, `findById (${column}=${id})`);
        }

        return data as T;
    }

    /**
     * Update a record
     */
    async update(id: string, updates: Partial<T>, idColumn: string = 'id'): Promise<T | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .update(updates as any)
            .eq(idColumn, id)
            .select()
            .single();

        if (error) {
            this.handleError(error, 'update');
        }

        return data as T;
    }

    /**
     * Delete a record
     */
    async delete(id: string, idColumn: string = 'id'): Promise<boolean> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq(idColumn, id);

        if (error) {
            this.handleError(error, 'delete');
            return false;
        }

        return true;
    }

    /**
     * Find all records matching a query object (simple equality)
     */
    async find(query: Partial<T>): Promise<T[]> {
        let builder = supabase.from(this.tableName).select('*');

        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                // @ts-ignore
                builder = builder.eq(key, query[key]);
            }
        }

        const { data, error } = await builder;

        if (error) {
            this.handleError(error, 'find');
        }

        return (data || []) as T[];
    }

    protected handleError(error: PostgrestError, operation: string) {
        console.error(`[${this.tableName}] DB Error during ${operation}:`, error);
        throw new Error(`Database error in ${operation}: ${error.message}`);
    }
}
