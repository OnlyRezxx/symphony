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

  const InputLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">{children}</label>
  );

  if (loading) return null;

  if (!user) {
    return (
      <div className="container mx-auto py-32 px-6 flex justify-center">
        <div className="border border-border bg-zinc-950/50 rounded-xl p-12 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Akses Dibatasi</h2>
          <p className="text-muted-foreground mb-8 text-sm">Silakan masuk untuk melanjutkan proses pendaftaran staff.</p>
          <Link to="/auth/login" className="h-10 px-6 inline-flex items-center justify-center rounded-md bg-white text-black font-bold text-sm w-full transition-all hover:bg-zinc-200">Masuk Sekarang</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-32 px-6 text-center max-w-2xl">
        <div className="w-16 h-16 bg-zinc-800 border border-border rounded-full flex items-center justify-center mx-auto mb-8 text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Lamaran Terkirim</h2>
        <p className="text-muted-foreground mb-10 text-sm">Tim administrasi akan segera meninjau aplikasi Anda. Silakan cek dashboard secara berkala.</p>
        <button onClick={() => navigate('/dashboard')} className="h-10 px-8 bg-white text-black rounded-md font-bold text-sm hover:bg-zinc-200 transition-all">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-6 max-w-3xl">
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-2 text-gradient">Formulir Rekrutmen</h2>
        <p className="text-muted-foreground text-sm font-medium">Berikan informasi selengkap mungkin untuk meningkatkan peluang Anda.</p>
      </div>

      <div className="border border-border bg-zinc-950/30 rounded-xl p-8 md:p-12">
        {error && <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <InputLabel>Username Minecraft</InputLabel>
              <input 
                required
                type="text"
                className="w-full bg-black border border-border rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-white outline-none transition-all"
                placeholder="Steve_Symphony"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <InputLabel>ID Discord</InputLabel>
              <input 
                required
                type="text"
                className="w-full bg-black border border-border rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-white outline-none transition-all"
                placeholder="username#0000"
                value={formData.discord}
                onChange={e => setFormData({...formData, discord: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <InputLabel>Usia</InputLabel>
              <input 
                required
                type="number"
                className="w-full bg-black border border-border rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-white outline-none transition-all"
                placeholder="18"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <InputLabel>Posisi</InputLabel>
              <select 
                className="w-full bg-black border border-border rounded-md px-4 py-2.5 text-sm focus:ring-1 focus:ring-white outline-none transition-all appearance-none cursor-pointer"
                value={formData.role_id}
                onChange={e => setFormData({...formData, role_id: e.target.value})}
              >
                {STAFF_ROLES.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <InputLabel>Pengalaman Staff</InputLabel>
            <textarea 
              required
              rows={4}
              className="w-full bg-black border border-border rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all resize-none"
              placeholder="Ceritakan pengalaman Anda di server lain..."
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <InputLabel>Motivasi Bergabung</InputLabel>
            <textarea 
              required
              rows={4}
              className="w-full bg-black border border-border rounded-md px-4 py-3 text-sm focus:ring-1 focus:ring-white outline-none transition-all resize-none"
              placeholder="Mengapa Anda ingin menjadi bagian dari tim kami?"
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-white text-black rounded-md font-bold text-sm transition-all hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;