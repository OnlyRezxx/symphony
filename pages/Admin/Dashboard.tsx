
import React, { useState, useEffect } from 'react';
import { fetchAllApplications, updateApplicationStatus } from '../../services/supabase';
import { Application, ApplicationStatus } from '../../types';
import { STAFF_ROLES } from '../../constants';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    const data = await fetchAllApplications();
    setApplications(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplicationStatus(id, status);
    setApplications(apps => apps.map(a => a.id === id ? {...a, status} : a));
    if (selectedApp?.id === id) setSelectedApp({...selectedApp, status});
  };

  return (
    <div className="container mx-auto py-14 px-6 max-w-7xl">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2">Admin Control</h2>
          <p className="text-muted-foreground text-lg font-medium">Terdapat {applications.length} lamaran masuk.</p>
        </div>
        <button onClick={loadApps} className="h-12 px-6 bg-secondary border border-border rounded-xl font-bold flex items-center hover:bg-secondary/80">Refresh</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center opacity-40">Memuat...</div>
          ) : (
            applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-6 rounded-2xl cursor-pointer border transition-all ${
                  selectedApp?.id === app.id ? 'bg-primary/10 border-primary/50' : 'bg-card border-border/50 hover:border-primary/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-lg">{app.username}</h4>
                  <span className={`text-[10px] px-2 py-1 rounded font-black ${app.status === 'PENDING' ? 'text-amber-500' : app.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-rose-500'}`}>{app.status}</span>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="glass rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4">{selectedApp.username}</h3>
                  <div className="flex gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{selectedApp.discord}</span>
                    <span>{selectedApp.age} TAHUN</span>
                    <span>{STAFF_ROLES.find(r => r.id === selectedApp.role_id)?.name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.ACCEPTED)} className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600">Terima</button>
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.REJECTED)} className="px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-rose-600">Tolak</button>
                </div>
              </div>

              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Pengalaman</h4>
                  <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50">{selectedApp.experience}</div>
                </section>
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Motivasi</h4>
                  <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50">{selectedApp.reason}</div>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-[500px] glass rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground border-dashed border-border/50">
              <p className="font-bold uppercase tracking-widest text-xs">Pilih lamaran untuk meninjau</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
