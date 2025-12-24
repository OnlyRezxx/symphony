
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyApplications } from '../../services/supabase';
import { Application } from '../../types';
import { STAFF_ROLES } from '../../constants';

const UserDashboard: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications().then(data => {
      setApps(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto py-20 px-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Dashboard Saya</h2>
          <p className="text-muted-foreground font-medium">Pantau status pendaftaran staff Anda.</p>
        </div>
        <Link to="/apply" className="h-12 px-8 bg-primary text-white rounded-xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          Buat Lamaran Baru
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-bold text-xs uppercase tracking-widest opacity-40">Memuat Data...</div>
      ) : apps.length === 0 ? (
        <div className="glass rounded-[2rem] p-20 text-center border-dashed border-border/50">
          <p className="text-muted-foreground font-medium mb-6">Anda belum pernah mengirim lamaran.</p>
          <Link to="/apply" className="text-primary font-bold hover:underline">Klik di sini untuk mendaftar</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center font-black">
                  {STAFF_ROLES.find(r => r.id === app.role_id)?.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-lg tracking-tight">{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Diajukan pada {new Date(app.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${
                app.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400' :
                app.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {app.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
