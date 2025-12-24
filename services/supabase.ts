
const SUPABASE_URL = (window as any).SUPABASE_URL || 'https://jnzamhzkhbzqnkwzsvod.supabase.co';
const SUPABASE_ANON_KEY = (window as any).SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemFtaHpraGJ6cW5rd3pzdm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODUzNjAsImV4cCI6MjA4MjE2MTM2MH0.GEU5eDu9jtIyQd-TqzbLDFLWLsptbiTVkwMs6pitvwQ';

export const supabaseClient = (window as any).supabase 
  ? (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const signUp = async (email: string, pass: string) => {
  const { data, error } = await supabaseClient.auth.signUp({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, pass: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  await supabaseClient.auth.signOut();
};

// Added missing getCurrentUser export
export const getCurrentUser = async () => {
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error) return 'user';
  return data.role;
};

export const fetchMyApplications = async () => {
  const user = (await supabaseClient.auth.getUser()).data.user;
  if (!user) return [];
  const { data, error } = await supabaseClient
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchAllApplications = async () => {
  const { data, error } = await supabaseClient
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const submitApplication = async (application: any) => {
  const user = (await supabaseClient.auth.getUser()).data.user;
  if (!user) throw new Error("Login diperlukan");
  const { data, error } = await supabaseClient
    .from('applications')
    .insert([{ ...application, user_id: user.id }]);
  if (error) throw error;
  return data;
};

export const updateApplicationStatus = async (id: string, status: string) => {
  const { data, error } = await supabaseClient
    .from('applications')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return data;
};
