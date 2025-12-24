
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Roles from './pages/Roles';
import AdminDashboard from './pages/Admin/Dashboard';
import UserDashboard from './pages/User/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { supabaseClient, getUserRole } from './services/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const initAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      if (session) {
        await checkRole(session.user.id);
      } else {
        // Menunggu sebentar untuk visual loading yang lebih baik
        setTimeout(() => setLoading(false), 800);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await checkRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkRole = async (userId: string) => {
    const r = await getUserRole(userId);
    setRole(r);
    setLoading(false);
    
    // Hilangkan manual splash screen dari index.html jika masih ada
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-bounce mb-8">
            S
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-white font-black tracking-[0.5em] text-xs uppercase opacity-80">Symphony Network</h1>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-primary w-full -translate-x-full animate-[progress-move_2s_infinite]"></div>
            </div>
            <p className="text-muted-foreground font-bold text-[9px] uppercase tracking-[0.2em] animate-pulse">Menghubungkan ke Pusat Data...</p>
          </div>
        </div>

        <style>{`
          @keyframes progress-move {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col animate-in fade-in duration-1000">
        <Navbar role={role} />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<Roles />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/auth/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={session ? <UserDashboard /> : <Navigate to="/auth/login" />} />
            <Route path="/apply" element={session ? <Apply /> : <Navigate to="/auth/login" />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="py-16 border-t border-border/40 text-center relative overflow-hidden bg-zinc-950/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">S</div>
                <span className="text-xs font-black tracking-[0.4em] uppercase opacity-70">SymphonyNetwork Operations</span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest opacity-30 max-w-md uppercase leading-relaxed">
                Platform Rekrutmen Staff Terpadu. Akses terbatas untuk personil resmi.
                <br/> Minecraft is a trademark of Mojang AB.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
