
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVER_NAME } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-24">
      <div className="hero-gradient absolute inset-0 -z-10 h-full w-full opacity-60"></div>
      
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-border bg-secondary/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-10 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse"></span>
          Rekrutmen Staff SymphonyNetwork Sedang Dibuka
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
          Bangun Masa Depan <br/> Bersama Kami
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
          Bergabunglah dengan tim elit {SERVER_NAME}. Kami mencari individu berdedikasi untuk membangun, melindungi, dan menginspirasi komunitas Minecraft global kami.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            to="/apply" 
            className="h-14 px-10 inline-flex items-center justify-center rounded-xl bg-primary text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-95"
          >
            Mulai Pendaftaran
          </Link>
          <Link 
            to="/roles" 
            className="h-14 px-10 inline-flex items-center justify-center rounded-xl glass text-foreground font-bold transition-all hover:bg-secondary border border-border/50 active:scale-95"
          >
            Lihat Struktur Staff
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { 
              title: "Dampak Global", 
              desc: "Berikan pengaruh positif kepada ribuan pemain dari seluruh penjuru dunia setiap hari.",
              icon: "🌍"
            },
            { 
              title: "Alat Profesional", 
              desc: "Akses dashboard manajemen staff eksklusif dan sistem analitik kami.",
              icon: "🛠️"
            },
            { 
              title: "Sistem Meritokrasi", 
              desc: "Jalur promosi yang adil dan pengakuan atas kontribusi luar biasa Anda.",
              icon: "📈"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-10 glass rounded-[2rem] text-left hover:border-primary/50 transition-all hover:-translate-y-2">
              <div className="text-4xl mb-6 bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-foreground font-extrabold text-xl mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
