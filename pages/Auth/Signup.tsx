
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/supabase';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    whatsapp: '',
    dob: '',
    age: 0,
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState(0);

  const navigate = useNavigate();

  // Hitung Umur Otomatis
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dob]);

  // Meter Kekuatan Password
  useEffect(() => {
    let s = 0;
    const p = formData.password;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setStrength(s);
  }, [formData.password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Konfirmasi password tidak cocok.");
      }
      if (formData.password.length < 6) {
        throw new Error("Password minimal 6 karakter.");
      }

      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        username: formData.username,
        whatsapp: formData.whatsapp,
        dob: formData.dob,
        age: formData.age
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mendaftarkan akun.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-zinc-800';
    if (strength === 1) return 'bg-rose-500';
    if (strength === 2) return 'bg-amber-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="border border-border bg-zinc-950/40 p-10 max-w-sm text-center rounded-2xl animate-in fade-in zoom-in glass">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil</h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Silakan cek email <b>{formData.email}</b> untuk verifikasi akun Anda.</p>
          <Link to="/auth/login" className="w-full h-11 bg-white text-black rounded-lg font-bold text-sm inline-flex items-center justify-center hover:bg-zinc-200 transition-all">Lanjut ke Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter mb-3">Rekrutmen Symphony</h2>
          <p className="text-muted-foreground text-sm font-medium">Lengkapi identitas asli Anda untuk proses seleksi</p>
        </div>

        <div className="border border-border bg-zinc-950/40 p-8 md:p-10 rounded-3xl glass shadow-2xl">
          {error && <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl text-center animate-shake">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Nama Lengkap & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Nama Lengkap</label>
                <input required type="text" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="Symphony Member" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Username Minecraft</label>
                <input required type="text" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="Steve123" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
            </div>

            {/* Email & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Gmail / Email</label>
                <input required type="email" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="mail@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">WhatsApp (Hanya Angka)</label>
                <input required type="tel" pattern="[0-9]*" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="0812345678" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              </div>
            </div>

            {/* DOB & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Tanggal Lahir</label>
                <input required type="date" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all [color-scheme:dark]" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Umur (Otomatis)</label>
                <div className="w-full bg-zinc-900/50 border border-border rounded-xl px-4 py-3 text-sm text-zinc-400 font-bold">
                  {formData.age > 0 ? `${formData.age} Tahun` : '-'}
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className={`h-1 w-6 rounded-full transition-all duration-500 ${strength >= idx ? getStrengthColor() : 'bg-zinc-800'}`}></div>
                    ))}
                  </div>
                </div>
                <input required type="password" title="Minimal 6 karakter" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="Min. 6 karakter" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Konfirmasi Password</label>
                <input required type="password" className="w-full bg-black border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all" placeholder="Ulangi password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            <button disabled={loading} className="w-full h-12 bg-white text-black rounded-xl font-black text-sm transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Mendaftarkan...
                </div>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-xs font-medium text-zinc-500">
              Sudah memiliki akun? <Link to="/auth/login" className="text-white font-bold hover:underline ml-1">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
