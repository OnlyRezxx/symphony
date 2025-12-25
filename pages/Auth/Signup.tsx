import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/supabase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (password.length < 6) throw new Error("Password minimal 6 karakter.");
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
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
        <div className="border border-border bg-zinc-950/40 p-10 max-w-sm text-center rounded-xl animate-in fade-in zoom-in">
          <h2 className="text-2xl font-bold mb-4">Pendaftaran Berhasil</h2>
          <p className="text-zinc-500 text-sm mb-8">Silakan cek email Anda untuk verifikasi akun Anda.</p>
          <Link to="/auth/login" className="h-10 px-8 bg-white text-black rounded-md font-bold text-sm inline-flex items-center">Lanjut ke Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Buat Akun Baru</h2>
          <p className="text-muted-foreground text-sm font-medium">Mulai perjalanan karir staff Anda</p>
        </div>

        <div className="border border-border bg-zinc-950/40 p-8 rounded-xl">
          {error && <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold rounded text-center">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-0.5">Email</label>
              <input required type="email" className="w-full bg-black border border-border rounded-md px-3.5 py-2 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="email@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-0.5">Password</label>
              <input required type="password" className="w-full bg-black border border-border rounded-md px-3.5 py-2 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="Min. 6 karakter" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button disabled={loading} className="w-full h-10 bg-white text-black rounded-md font-bold text-sm transition-all hover:bg-zinc-200 disabled:opacity-50">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs font-medium text-zinc-500">
              Sudah punya akun? <Link to="/auth/login" className="text-white hover:underline ml-1">Masuk sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;