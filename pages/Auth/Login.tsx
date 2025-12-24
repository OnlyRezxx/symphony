
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../services/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let msg = "Email atau kata sandi tidak valid.";
      if (err.message.includes("Invalid login credentials")) msg = "Email atau password salah.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        <div className="glass rounded-[2.5rem] p-10 md:p-12 border-border/50 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Portal Masuk</h2>
            <p className="text-muted-foreground text-sm font-medium">Lanjutkan ke panel operasional Anda</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl flex items-center gap-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Kredensial Email</label>
              <input 
                required 
                type="email" 
                className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-semibold transition-all" 
                placeholder="nama@provider.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Kata Sandi</label>
              </div>
              <input 
                required 
                type="password" 
                className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-semibold transition-all" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full h-14 bg-primary text-white rounded-xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Otorisasi...
                </>
              ) : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Belum punya akun? <Link to="/auth/signup" className="text-primary hover:underline ml-1">Daftar Akun Baru</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
