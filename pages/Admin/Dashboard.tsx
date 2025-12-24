
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
    try {
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
      if (selectedApp?.id === id) setSelectedApp({...selectedApp, status});
    } catch (err) {
      alert("Database Error");
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-7xl animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Area Administrasi Rahasia
          </div>
          <h2 className="text-5xl font-black tracking-tighter">Pusat Evaluasi</h2>
          <p className="text-muted-foreground text-lg font-medium">Memproses total {applications.length} berkas kandidasi.</p>
        </div>
        <button 
          onClick={loadApps} 
          className="h-12 px-8 bg-secondary border border-border rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary/80 flex items-center shadow-xl transition-all active:scale-95"
        >
          <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
          Sinkronkan Antrian
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Memindai Rekaman...</span>
            </div>
          ) : (
            applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col gap-3 group relative overflow-hidden ${
                  selectedApp?.id === app.id ? 'bg-primary/10 border-primary/50 shadow-2xl' : 'bg-card border-transparent hover:border-border/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-xl tracking-tighter">{app.username}</h4>
                  <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'PENDING' ? 'bg-amber-500' : app.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</span>
                  <span className="opacity-40">{new Date(app.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-8">
          {selectedApp ? (
            <div className="glass rounded-[3rem] p-10 md:p-14 shadow-2xl relative border-border/50 animate-in slide-in-from-right-4 duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                <div>
                  <h3 className="text-5xl font-black tracking-tighter mb-4">{selectedApp.username}</h3>
                  <div className="flex flex-wrap gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>{selectedApp.discord}</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500"></div>{selectedApp.age} TAHUN</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div>{STAFF_ROLES.find(r => r.id === selectedApp.role_id)?.name}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.ACCEPTED)} className="flex-1 md:flex-none h-14 px-8 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Loloskan</button>
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.REJECTED)} className="flex-1 md:flex-none h-14 px-8 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Gugurkan</button>
                </div>
              </div>

              <div className="space-y-12">
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5 flex items-center gap-3">
                    <div className="w-6 h-0.5 bg-primary"></div> Eksplanasi Pengalaman
                  </h4>
                  <div className="p-8 bg-zinc-900/50 rounded-2xl border border-border/50 text-foreground/90 font-medium leading-relaxed italic">
                    "{selectedApp.experience}"
                  </div>
                </section>
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5 flex items-center gap-3">
                    <div className="w-6 h-0.5 bg-primary"></div> Argumen Motivasi
                  </h4>
                  <div className="p-8 bg-zinc-900/50 rounded-2xl border border-border/50 text-foreground/90 font-medium leading-relaxed">
                    {selectedApp.reason}
                  </div>
                </section>
                
                <div className="pt-10 border-t border-border flex justify-between items-center">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">UUID_ORIGIN: {selectedApp.id}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">Status Saat Ini:</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedApp.status === 'ACCEPTED' ? 'text-emerald-500' : selectedApp.status === 'REJECTED' ? 'text-rose-500' : 'text-amber-500'}`}>{selectedApp.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] glass rounded-[3rem] flex flex-col items-center justify-center text-muted-foreground border-dashed border-border/60 text-center px-16 group transition-all">
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary flex items-center justify-center mb-10 border border-border group-hover:scale-110 transition-transform shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4 tracking-tighter">Symphony Inspector</h3>
              <p className="max-w-[320px] font-medium leading-relaxed opacity-60">Pilih berkas dari antrian navigasi di sebelah kiri untuk meninjau detail aplikasi staff secara menyeluruh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
