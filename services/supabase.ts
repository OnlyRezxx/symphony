
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jnzamhzkhbzqnkwzsvod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemFtaHpraGJ6cW5rd3pzdm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODUzNjAsImV4cCI6MjA4MjE2MTM2MH0.GEU5eDu9jtIyQd-TqzbLDFLWLsptbiTVkwMs6pitvwQ';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUp = async (email: string, pass: string, profileData: any) => {
  const { data, error } = await supabaseClient.auth.signUp({ email, password: pass });
  if (error) throw error;
  if (data.user) {
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update(profileData)
      .eq('id', data.user.id);
    if (profileError) throw profileError;
  }
  return data;
};

export const signIn = async (identifier: string, pass: string) => {
  let email = identifier;
  
  // Jika identifier adalah nomor WhatsApp (hanya angka)
  if (/^\d+$/.test(identifier)) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('whatsapp', identifier)
      .single();
    
    if (error || !data) throw new Error("Nomor WhatsApp tidak terdaftar.");
    email = data.email;
  }

  return supabaseClient.auth.signInWithPassword({ email, password: pass });
};

export const signOut = () => supabaseClient.auth.signOut();

export const getCurrentUser = async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
};

export const getUserRole = async (userId: string): Promise<'user' | 'admin'> => {
  const { data } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role || 'user';
};

export const fetchMyApplications = async () => {
  const user = (await supabaseClient.auth.getUser()).data.user;
  if (!user) return [];
  const { data } = await supabaseClient
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
};

export const fetchAllApplications = async () => {
  const { data } = await supabaseClient
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const submitApplication = async (application: any) => {
  const user = (await supabaseClient.auth.getUser()).data.user;
  if (!user) throw new Error("Login diperlukan");
  return supabaseClient.from('applications').insert([{ ...application, user_id: user.id }]);
};

export const updateApplicationStatus = async (id: string, status: string) => {
  return supabaseClient.from('applications').update({ status }).eq('id', id);
};
