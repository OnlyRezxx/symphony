
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/supabase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      alert("Pendaftaran berhasil! Cek email untuk verifikasi (jika aktif) atau langsung login.");
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-32 flex justify-center px-6">
      <div className="glass w-full max-w-md p-10 rounded-[2rem] border-border/50">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter mb-2">Buat Akun</h2>
          <p className="text-muted-foreground text-sm font-medium">Gabung tim SymphonyNetwork</p>
        </div>

        {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
            <input required type="email" className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-medium" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
            <input required type="password" className="w-full bg-background border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/40 outline-none font-medium" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full h-14 bg-primary text-white rounded-xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Daftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Sudah punya akun? <Link to="/auth/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
