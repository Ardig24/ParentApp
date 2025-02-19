import { supabase } from '../lib/supabase';

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return;
    }
    console.log('Successfully connected to Supabase!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();
