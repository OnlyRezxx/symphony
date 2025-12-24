
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/supabase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (password.length < 6) throw new Error("Kata sandi minimal 6 karakter.");
      await signUp(email, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mendaftarkan akun.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="glass rounded-[2.5rem] p-12 max-w-md text-center border-emerald-500/20 shadow-2xl animate-in fade-in zoom-in">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-emerald-500 border border-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter">Pendaftaran Berhasil</h2>
          <p className="text-muted-foreground mb-10 font-medium">Silakan cek email Anda untuk verifikasi atau Anda bisa mencoba masuk sekarang.</p>
          <Link to="/auth/login" className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
            Lanjut ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 relative">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        <div className="glass rounded-[2.5rem] p-10 md:p-12 border-border/50 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Buat Akun</h2>
            <p className="text-muted-foreground text-sm font-medium">Mulai perjalanan karir staff Anda</p>
          </div>

          {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl animate-shake">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Alamat Email</label>
              <input required type="email" className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-semibold" placeholder="email@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Kata Sandi Baru</label>
              <input required type="password" className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-semibold" placeholder="Min. 6 karakter" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button disabled={loading} className="w-full h-14 bg-primary text-white rounded-xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Sudah memiliki akun? <Link to="/auth/login" className="text-primary hover:underline ml-1">Masuk Kembali</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
