import React from 'react';
import { Link } from 'react-router-dom';
import { SERVER_NAME } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black -z-10"></div>
      
      <div className="container mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center rounded-full border border-border bg-zinc-900/50 px-3 py-1 text-[11px] font-medium text-zinc-400 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span>
          Rekrutmen Staff SymphonyNetwork 2024 Dibuka
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight text-gradient max-w-5xl mx-auto">
          Membangun Komunitas,<br/>Menciptakan Legenda.
        </h1>
        
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium">
          Bergabunglah dengan tim elit {SERVER_NAME}. Kami mencari individu berdedikasi untuk menjaga, membangun, dan mengembangkan komunitas Minecraft kami.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-32">
          <Link 
            to="/apply" 
            className="h-11 px-8 inline-flex items-center justify-center rounded-md bg-white text-black font-semibold transition-all hover:bg-zinc-200"
          >
            Mulai Pendaftaran
          </Link>
          <Link 
            to="/roles" 
            className="h-11 px-8 inline-flex items-center justify-center rounded-md border border-border bg-transparent text-foreground font-semibold transition-all hover:bg-zinc-900"
          >
            Lihat Posisi
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { 
              title: "Dampak Nyata", 
              desc: "Berikan pengaruh positif langsung kepada ribuan pemain setiap hari di server kami.",
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            },
            { 
              title: "Panel Profesional", 
              desc: "Akses dashboard manajemen staff eksklusif dengan sistem monitoring terintegrasi.",
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            },
            { 
              title: "Karir Terstruktur", 
              desc: "Jalur promosi yang jelas berdasarkan kinerja dan kontribusi nyata Anda.",
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 border border-border bg-zinc-950/50 rounded-xl text-left hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;