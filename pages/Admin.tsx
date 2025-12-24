
import React, { useState, useEffect } from 'react';
// Corrected import to use fetchAllApplications
import { fetchAllApplications, updateApplicationStatus } from '../services/supabase';
import { Application, ApplicationStatus } from '../types';
import { STAFF_ROLES } from '../constants';

const Admin: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert("Akses Ditolak: Kredensial Keamanan Tidak Valid");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadApps();
    }
  }, [isAuthenticated]);

  const loadApps = async () => {
    try {
      setLoading(true);
      // Corrected function call to fetchAllApplications
      const data = await fetchAllApplications();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(apps => apps.map(a => a.id === id ? {...a, status} : a));
      if (selectedApp?.id === id) {
        setSelectedApp({...selectedApp, status});
      }
    } catch (err) {
      alert("Sinkronisasi Database Gagal.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-40 px-6 max-w-md">
        <div className="glass rounded-[2.5rem] p-12 border-border text-center shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-50"></div>
          <div className="w-20 h-20 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 text-rose-500 border border-rose-500/20">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter">Otoritas Admin</h2>
          <p className="text-muted-foreground text-sm font-medium mb-10">Area terbatas. Masukkan token akses operasional.</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="password"
              placeholder="Token Akses Keamanan"
              className="w-full bg-background border border-border rounded-2xl px-5 py-5 text-center focus:outline-none focus:ring-2 focus:ring-primary/40 text-lg font-black tracking-[0.3em] uppercase"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="w-full h-16 bg-foreground text-background hover:bg-zinc-200 rounded-2xl font-black transition-all text-lg shadow-2xl shadow-white/5 active:scale-95">
              Verifikasi Identitas
            </button>
          </form>
          <p className="mt-10 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-50">
            Token Default: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-14 px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <div className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-2">Manajemen Operasi</div>
          <h2 className="text-5xl font-black tracking-tighter mb-2">Pusat Kendali</h2>
          <p className="text-muted-foreground text-lg font-medium">Mengevaluasi {applications.length} kandidasi kandidat staff.</p>
        </div>
        <button 
          onClick={loadApps}
          className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-secondary text-foreground text-sm font-black hover:bg-secondary/80 border border-border transition-all shadow-lg active:scale-95"
        >
          <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
          Sinkronkan Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-5 max-h-[80vh] overflow-y-auto pr-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-5">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Mengambil Rekaman...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-24 glass rounded-[2rem] text-muted-foreground font-bold">Kotak Masuk Kosong</div>
          ) : (
            applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-6 rounded-[1.5rem] cursor-pointer transition-all border group relative overflow-hidden ${
                  selectedApp?.id === app.id 
                    ? 'bg-primary/10 border-primary/50 shadow-2xl' 
                    : 'bg-card border-border hover:border-primary/30'
                }`}
              >
                {selectedApp?.id === app.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-foreground text-lg tracking-tight">{app.username}</h4>
                  <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-[0.2em] ${
                    app.status === ApplicationStatus.ACCEPTED ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    app.status === ApplicationStatus.REJECTED ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {app.status === 'PENDING' ? 'MENUNGGU' : app.status === 'ACCEPTED' ? 'DITERIMA' : 'DITOLAK'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span className="uppercase tracking-widest">{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</span>
                  <span className="opacity-60">{new Date(app.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="glass rounded-[2.5rem] p-10 md:p-14 border-border sticky top-24 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-14 relative z-10">
                <div>
                  <h3 className="text-5xl font-black tracking-tighter mb-4">{selectedApp.username}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>{selectedApp.discord}</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>Usia {selectedApp.age}</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div>{STAFF_ROLES.find(r => r.id === selectedApp.role_id)?.name}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.ACCEPTED)}
                    className="flex-1 md:flex-none h-12 px-8 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Terima
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.REJECTED)}
                    className="flex-1 md:flex-none h-12 px-8 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95"
                  >
                    Tolak
                  </button>
                </div>
              </div>

              <div className="space-y-12 relative z-10">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5 flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-primary"></div> Pengalaman Profesional
                  </h4>
                  <div className="p-8 bg-secondary/30 rounded-[1.5rem] text-base text-foreground/90 leading-relaxed font-medium border border-border/50">
                    {selectedApp.experience}
                  </div>
                </section>
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5 flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-primary"></div> Motivasi Kandidat
                  </h4>
                  <div className="p-8 bg-secondary/30 rounded-[1.5rem] text-base text-foreground/90 leading-relaxed font-medium border border-border/50">
                    {selectedApp.reason}
                  </div>
                </section>
                
                <div className="pt-10 border-t border-border flex flex-wrap justify-between items-center text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] gap-4">
                  <span className="opacity-50">RECORD_ID: {selectedApp.id}</span>
                  <span className="opacity-50">Diterima {new Date(selectedApp.created_at).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center glass rounded-[3rem] border-dashed border-border/60 text-muted-foreground text-center px-12 group transition-all">
              <div className="w-20 h-20 rounded-[2rem] bg-secondary flex items-center justify-center mb-8 border border-border group-hover:scale-110 transition-transform shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m15 18-6-6 6-6"/></svg>
              </div>
              <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter">Peninjau Rekaman</h3>
              <p className="max-w-[280px] font-medium leading-relaxed">Pilih profil kandidat dari daftar samping untuk memulai tinjauan teknis dan administratif.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
