
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { STAFF_ROLES, SERVER_NAME } from '../constants';
import { submitApplication, getCurrentUser } from '../services/supabase';

const Apply: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    discord: '',
    age: '',
    role_id: 'helper',
    experience: '',
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitApplication({
        username: formData.username,
        discord: formData.discord,
        age: parseInt(formData.age) || 0,
        role_id: formData.role_id,
        experience: formData.experience,
        reason: formData.reason,
        status: 'PENDING',
        created_at: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err: any) {
      setError("Gagal mengirim lamaran: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-40 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs">Memvalidasi Sesi...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-32 px-6 flex justify-center">
        <div className="glass rounded-[2rem] p-12 max-w-md text-center border-border shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-amber-500 border border-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter">Akses Terbatas</h2>
          <p className="text-muted-foreground mb-10 font-medium leading-relaxed">Anda harus masuk atau membuat akun terlebih dahulu untuk mengakses formulir pendaftaran staff.</p>
          <Link 
            to="/auth" 
            className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            Masuk / Daftar
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-32 px-6 text-center max-w-2xl">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-emerald-500 border border-emerald-500/20 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 className="text-5xl font-black mb-6 tracking-tighter">Lamaran Diterima</h2>
        <p className="text-muted-foreground mb-12 text-lg leading-relaxed font-medium">
          Formulir pendaftaran Anda untuk posisi <strong>{STAFF_ROLES.find(r => r.id === formData.role_id)?.name}</strong> telah berhasil dikirimkan ke tim administrasi {SERVER_NAME}.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="h-14 px-12 inline-flex items-center justify-center rounded-xl bg-secondary text-foreground font-black text-lg hover:bg-secondary/80 transition-all border border-border shadow-xl shadow-black/20"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-6 max-w-4xl">
      <div className="mb-14">
        <div className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-3">Formulir Rekrutmen</div>
        <h2 className="text-5xl font-black tracking-tighter mb-4">Kandidasi Staff</h2>
        <p className="text-muted-foreground text-lg font-medium">Berikan informasi yang akurat dan detail. Kualitas jawaban Anda menentukan masa depan Anda di tim kami.</p>
      </div>

      <div className="glass rounded-[2.5rem] p-10 md:p-14 shadow-2xl border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Username Minecraft</label>
              <input 
                required
                type="text"
                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                placeholder="cth: SteveSymphony"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">ID Discord</label>
              <input 
                required
                type="text"
                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                placeholder="cth: username#0000"
                value={formData.discord}
                onChange={e => setFormData({...formData, discord: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Usia Saat Ini</label>
              <input 
                required
                type="number"
                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                placeholder="cth: 18"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Posisi yang Diinginkan</label>
              <select 
                className="w-full bg-background/50 border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer font-semibold"
                value={formData.role_id}
                onChange={e => setFormData({...formData, role_id: e.target.value})}
              >
                {STAFF_ROLES.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Riwayat Pengalaman Staff</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-background/50 border border-border rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium leading-relaxed"
              placeholder="Sebutkan server mana saja yang pernah Anda kelola dan apa tanggung jawab Anda..."
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Motivasi & Alasan Bergabung</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-background/50 border border-border rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium leading-relaxed"
              placeholder="Mengapa kami harus memilih Anda dibandingkan kandidat lainnya?"
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-2xl font-black text-xl tracking-tight transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                Mengirim Data...
              </>
            ) : 'Kirim Lamaran Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;
