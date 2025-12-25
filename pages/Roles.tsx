import React from 'react';
import { STAFF_ROLES, SERVER_NAME } from '../constants';

const Roles: React.FC = () => {
  return (
    <div className="container mx-auto py-24 px-6 max-w-6xl">
      <div className="mb-20 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-gradient">Struktur Organisasi</h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Tentukan peran yang sesuai dengan keahlian Anda dan bantu {SERVER_NAME} menjadi komunitas yang lebih baik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAFF_ROLES.map((role) => (
          <div key={role.id} className="group flex flex-col border border-border bg-zinc-950/40 rounded-xl p-8 transition-all hover:bg-zinc-900/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center border border-border text-white font-bold text-lg`}>
                  {role.name[0]}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{role.name}</h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-border px-2 py-1 rounded">LEVEL {role.id === 'helper' ? 'I' : role.id === 'moderator' ? 'II' : 'III'}</span>
            </div>
            
            <p className="text-zinc-400 mb-10 text-sm leading-relaxed flex-grow">
              {role.description}
            </p>

            <div className="grid grid-cols-1 gap-8">
              <div>
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-zinc-700"></span> Syarat
                </h4>
                <ul className="space-y-2">
                  {role.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-zinc-500">
                      <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-zinc-700"></span> Izin Akses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-medium text-zinc-400">
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