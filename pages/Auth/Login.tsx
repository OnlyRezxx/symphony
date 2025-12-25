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
      setError("Email atau kata sandi tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Masuk ke Portal</h2>
          <p className="text-muted-foreground text-sm font-medium">Lanjutkan proses rekrutmen Anda</p>
        </div>

        <div className="border border-border bg-zinc-950/40 p-8 rounded-xl">
          {error && <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold rounded text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-0.5">Email</label>
              <input 
                required 
                type="email" 
                className="w-full bg-black border border-border rounded-md px-3.5 py-2 text-sm focus:ring-1 focus:ring-white outline-none transition-all" 
                placeholder="nama@provider.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-0.5">Password</label>
              <input 
                required 
                type="password" 
                className="w-full bg-black border border-border rounded-md px-3.5 py-2 text-sm focus:ring-1 focus:ring-white outline-none transition-all" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full h-10 bg-white text-black rounded-md font-bold text-sm transition-all hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? 'Mengakses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs font-medium text-zinc-500">
              Belum punya akun? <Link to="/auth/signup" className="text-white hover:underline ml-1">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;