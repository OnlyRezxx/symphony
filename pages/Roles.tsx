
import React from 'react';
import { STAFF_ROLES, SERVER_NAME } from '../constants';

const Roles: React.FC = () => {
  return (
    <div className="container mx-auto py-20 px-6 max-w-6xl">
      <div className="mb-20 text-center">
        <h2 className="text-5xl font-black tracking-tighter mb-6">Struktur Organisasi</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
          Setiap peran dalam {SERVER_NAME} sangat penting untuk menjaga keharmonisan ekosistem komunitas kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {STAFF_ROLES.map((role) => (
          <div key={role.id} className="group flex flex-col glass rounded-[2.5rem] p-10 transition-all hover:bg-secondary/20 hover:border-primary/30 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  {role.name[0]}
                </div>
                <h3 className="text-3xl font-black tracking-tight">{role.name}</h3>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-muted-foreground px-3 py-1.5 bg-border rounded-lg border border-border/50">LEVEL {role.id === 'helper' ? 'I' : role.id === 'moderator' ? 'II' : 'III'}</span>
            </div>
            
            <p className="text-muted-foreground mb-10 text-base leading-relaxed font-medium flex-grow">
              {role.description}
            </p>

            <div className="space-y-10">
              <div>
                <h4 className="text-primary uppercase text-[10px] font-black tracking-[0.2em] mb-5 flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-primary"></div> Syarat Utama
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {role.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm text-foreground/80 font-semibold">
                      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-primary uppercase text-[10px] font-black tracking-[0.2em] mb-5 flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-primary"></div> Izin & Hak Akses
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {role.permissions.map((perm, i) => (
                    <span key={i} className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-[11px] font-bold text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground transition-all">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;
