
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    supabaseClient?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRole(session.user.id);
      else setLoading(false);
    });

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

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <Navbar role={role} />
        <main className="relative z-10">
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
        
        <footer className="py-20 border-t border-border/40 text-center relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white">S</div>
                <span className="text-sm font-black tracking-[0.3em] uppercase opacity-80">SymphonyNetwork</span>
              </div>
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest opacity-40">
                © 2024 SymphonyNetwork Staff Operations. Profesionalisme adalah kunci.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
