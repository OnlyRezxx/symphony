
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
    supabaseClient?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRole(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkRole(session.user.id);
      else {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-primary font-black tracking-[0.3em] text-[10px] uppercase animate-pulse">Symphony OS Initializing...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
        <Navbar role={role} />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<Roles />} />
            
            {/* Auth Routes - URL TERPISAH */}
            <Route path="/auth/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/auth/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />
            
            {/* Dashboard User - Halaman Utama setelah Login */}
            <Route path="/dashboard" element={session ? <UserDashboard /> : <Navigate to="/auth/login" />} />
            <Route path="/apply" element={session ? <Apply /> : <Navigate to="/auth/login" />} />
            
            {/* Dashboard Admin - Area Rahasia */}
            <Route path="/admin/dashboard" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            
            {/* Fallback */}
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
