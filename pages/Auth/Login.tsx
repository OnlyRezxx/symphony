
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../services/supabase';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Email atau WA
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await signIn(identifier, password);
      if (authError) throw authError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "Email/WhatsApp atau kata sandi salah." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl shadow-xl shadow-white/10">S</div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">Pusat Akses Staff</h2>
          <p className="text-muted-foreground text-sm font-medium">Masuk menggunakan Gmail atau WhatsApp</p>
        </div>

        <div className="border border-border bg-zinc-950/40 p-10 rounded-3xl glass shadow-2xl">
          {error && <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl text-center animate-shake">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Gmail / No. WhatsApp</label>
              <input 
                required 
                type="text" 
                className="w-full bg-black border border-border rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-white outline-none transition-all" 
                placeholder="nama@gmail.com / 0812..."
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
              <input 
                required 
                type="password" 
                className="w-full bg-black border border-border rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-white outline-none transition-all" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full h-14 bg-white text-black rounded-xl font-black text-sm transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Memverifikasi...
                </div>
              ) : 'Masuk Portal'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-xs font-medium text-zinc-500">
              Belum punya akun? <Link to="/auth/signup" className="text-white font-bold hover:underline ml-1">Buat akun rekrutmen</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
