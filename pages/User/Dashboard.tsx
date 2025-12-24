
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications, supabaseClient } from '../../services/supabase';
import { Application } from '../../types';
import { STAFF_ROLES } from '../../constants';

const UserDashboard: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => setUser(data.user));
    fetchMyApplications().then(data => {
      setApps(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto py-16 px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-primary/20 to-transparent p-10 rounded-[3rem] border border-primary/20 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="text-center md:text-left">
          <div className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-3">Selamat Datang Kembali</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 truncate max-w-md">{user?.email?.split('@')[0]}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-background/50 backdrop-blur-md border border-white/5 rounded-xl text-xs font-bold">
              ID: {user?.id.slice(0, 8)}...
            </div>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
              Verified User
            </div>
          </div>
        </div>
        <Link to="/apply" className="h-16 px-10 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
          <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Buat Lamaran Baru
        </Link>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          Status Lamaran Aktif
        </h3>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi Data...</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="glass rounded-[2.5rem] p-20 text-center border-dashed border-border/50">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          </div>
          <p className="text-muted-foreground font-bold text-lg mb-6">Belum ada riwayat lamaran terdeteksi.</p>
          <Link to="/apply" className="text-primary font-black hover:underline uppercase tracking-widest text-xs">Mulai Pendaftaran Pertama Anda</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {apps.map(app => (
            <div key={app.id} className="glass p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8 border-border/30 hover:border-primary/30 transition-all hover:bg-primary/5 group shadow-xl">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-2xl ${STAFF_ROLES.find(r => r.id === app.role_id)?.color || 'bg-secondary'} flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-black/30 group-hover:scale-110 transition-transform`}>
                  {STAFF_ROLES.find(r => r.id === app.role_id)?.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-2xl tracking-tighter">{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</h4>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">Diajukan: {new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3">
                <div className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg ${
                  app.status === 'ACCEPTED' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                  app.status === 'REJECTED' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                  'bg-amber-500 text-black shadow-amber-500/20'
                }`}>
                  {app.status === 'PENDING' ? 'DALAM PENINJAUAN' : app.status === 'ACCEPTED' ? 'DITERIMA' : 'DITOLAK'}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">Ref ID: {app.id.slice(0, 8)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
