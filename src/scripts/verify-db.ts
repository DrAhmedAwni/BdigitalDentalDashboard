
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Load env vars from .env file manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envConfig: Record<string, string> = {};
    envContent.split(/\r?\n/).forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            envConfig[key] = value;
        }
    });

    const supabaseUrl = envConfig.VITE_SUPABASE_URL;
    const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Error: Missing Supabase environment variables in .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function verifyConnection() {
        console.log('1. Testing Connection & Read Permissions...');
        const { data: cases, error: readError } = await supabase
            .from('cases')
            .select('id, case_code, updated_at')
            .limit(1);

        if (readError) {
            console.error('❌ Read failed:', readError.message);
            process.exit(1);
        }

        if (!cases || cases.length === 0) {
            console.log('⚠️ Connection successful, but "cases" table is empty.');
            process.exit(0);
        }

        console.log('✅ Read successful. Found case:', cases[0].case_code);

        // Test Update
        const testCase = cases[0];
        console.log('2. Testing Update Permissions...');
        const newDate = new Date().toISOString();
        const { error: updateError } = await supabase
            .from('cases')
            .update({ updated_at: newDate })
            .eq('id', testCase.id);

        if (updateError) {
            console.error('❌ Update failed:', updateError.message);
            console.error('   Auth/RLS policy likely prevents updates.');
            process.exit(1);
        } else {
            console.log('✅ Update successful! Edit Case will work.');
            process.exit(0);
        }
    }

    verifyConnection();

} catch (e) {
    console.error('Script failed:', e);
    process.exit(1);
}
