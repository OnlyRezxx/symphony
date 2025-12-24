
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../services/supabase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        setError("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau silakan coba masuk.");
        setIsLogin(true);
      }
    } catch (err: any) {
      // Menerjemahkan pesan error umum Supabase ke Bahasa Indonesia
      let message = err.message;
      if (message.includes("Invalid login credentials")) message = "Email atau kata sandi salah.";
      if (message.includes("User already registered")) message = "Email ini sudah terdaftar.";
      if (message.includes("Password should be at least 6 characters")) message = "Kata sandi minimal harus 6 karakter.";
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-24 px-6 flex justify-center">
      <div className="glass rounded-[2.5rem] p-10 md:p-14 w-full max-w-md border-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">{isLogin ? 'Selamat Datang' : 'Buat Akun'}</h2>
          <p className="text-muted-foreground text-sm font-medium">Silakan masuk untuk melanjutkan pendaftaran staff.</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            error.includes("berhasil") 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            <svg className="shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Alamat Email</label>
            <input 
              required
              type="email"
              className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
              placeholder="nama@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Kata Sandi</label>
            <input 
              required
              type="password"
              className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full h-14 bg-primary text-white rounded-xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (isLogin ? 'Masuk Sekarang' : 'Daftar Akun')}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-medium">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
