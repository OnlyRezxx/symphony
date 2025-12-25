
import React, { useState, useEffect } from 'react';
import { fetchAllApplications, updateApplicationStatus } from '../../services/supabase';
import { Application, ApplicationStatus } from '../../types';
import { STAFF_ROLES } from '../../constants';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadApps = async () => {
    setLoading(true);
    try {
      const data = await fetchAllApplications();
      setApplications(data as Application[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      alert("Gagal memperbarui status.");
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-7xl h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Pusat Administrasi</h2>
          <p className="text-zinc-500 text-sm font-medium">Terdapat {applications.length} aplikasi staff yang terdaftar.</p>
        </div>
        <button onClick={loadApps} className="text-[10px] font-bold uppercase tracking-widest border border-border px-5 py-2.5 rounded-md hover:bg-zinc-900 transition-all">
          Segarkan Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border rounded-2xl overflow-hidden flex-grow bg-zinc-950/20 glass">
        <div className="lg:col-span-4 border-r border-border overflow-y-auto custom-scrollbar bg-black/40">
          {loading ? (
            <div className="p-12 flex justify-center"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>
          ) : (
            applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-6 cursor-pointer border-b border-border transition-all flex flex-col gap-2 relative ${
                  selectedApp?.id === app.id ? 'bg-zinc-900/80' : 'hover:bg-zinc-900/30'
                }`}
              >
                {selectedApp?.id === app.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm tracking-tight">{app.username}</span>
                  <div className={`w-2 h-2 rounded-full ${app.status === 'PENDING' ? 'bg-amber-500' : app.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-destructive'}`}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{STAFF_ROLES.find(r => r.id === app.role_id)?.name}</span>
                  <span className="opacity-50 font-mono">{new Date(app.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-8 overflow-y-auto custom-scrollbar p-10 md:p-14 bg-black/10">
          {selectedApp ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div>
                  <h3 className="text-5xl font-bold tracking-tighter mb-4">{selectedApp.username}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{selectedApp.discord}</span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{selectedApp.age} TAHUN</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white uppercase tracking-widest">{STAFF_ROLES.find(r => r.id === selectedApp.role_id)?.name}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.ACCEPTED)} className="flex-1 md:flex-none px-6 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-zinc-200 transition-all">Terima</button>
                  <button onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.REJECTED)} className="flex-1 md:flex-none px-6 py-2.5 border border-destructive/50 text-destructive text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-destructive hover:text-white transition-all">Tolak</button>
                </div>
              </div>
              <div className="space-y-12">
                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-4"><span className="w-8 h-px bg-zinc-800"></span> Pengalaman</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium bg-white/5 p-8 rounded-2xl border border-white/5 whitespace-pre-wrap">{selectedApp.experience}</p>
                </section>
                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-4"><span className="w-8 h-px bg-zinc-800"></span> Motivasi</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium bg-white/5 p-8 rounded-2xl border border-white/5 whitespace-pre-wrap">{selectedApp.reason}</p>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center px-12">
              <div className="w-20 h-20 border border-zinc-800 rounded-3xl flex items-center justify-center mb-8 bg-zinc-900/20">
                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-30">Pilih berkas dari daftar untuk meninjau detail kandidat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
