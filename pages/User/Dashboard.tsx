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

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      ACCEPTED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20"
    };
    const labels = { PENDING: "Pending", ACCEPTED: "Diterima", REJECTED: "Ditolak" };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-16 px-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 p-8 border border-border bg-zinc-950/30 rounded-xl">
        <div className="text-center md:text-left">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status Keanggotaan</p>
          <h2 className="text-3xl font-bold tracking-tight mb-2 truncate max-w-md">{user?.email?.split('@')[0]}</h2>
          <div className="text-xs text-zinc-500 font-mono">UID: {user?.id}</div>
        </div>
        <Link to="/apply" className="h-10 px-6 bg-white text-black rounded-md font-bold text-sm flex items-center justify-center transition-all hover:bg-zinc-200">
          Buat Lamaran Baru
        </Link>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-1 h-5 bg-white rounded-full"></span>
          Riwayat Lamaran
        </h3>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>
      ) : apps.length === 0 ? (
        <div className="border border-dashed border-border p-20 text-center rounded-xl">
          <p className="text-zinc-500 text-sm mb-4">Anda belum pernah mengajukan lamaran.</p>
          <Link to="/apply" className="text-white text-xs font-bold uppercase tracking-widest hover:underline">Mulai Sekarang</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(app => (
            <div key={app.id} className="p-6 border border-border bg-zinc-950/20 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:border-zinc-700">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-10 h-10 bg-zinc-900 border border-border rounded flex items-center justify-center font-bold">
                  {STAFF_ROLES.find(r => r.id === app.role_id)?.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-none mb-1">{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Diajukan: {new Date(app.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;