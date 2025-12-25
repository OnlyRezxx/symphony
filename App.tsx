
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
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  const checkRole = async (userId: string) => {
    try {
      const r = await getUserRole(userId);
      setRole(r);
    } catch (e) {
      setRole('user');
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const hideLoader = () => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session: s } } = await supabaseClient.auth.getSession();
        setSession(s);
        if (s) await checkRole(s.user.id);
        else {
          setLoading(false);
          hideLoader();
        }
      } catch (err) {
        console.error("Initialization failed", err);
        setLoading(false);
        hideLoader();
      }
    };
    init();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s) await checkRole(s.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    /* Removed unsupported 'future' prop to fix TypeScript error */
    <Router>
      <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-white selection:text-black">
        <Navbar role={role} />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/auth/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/auth/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/dashboard" element={session ? <UserDashboard /> : <Navigate to="/auth/login" />} />
            <Route path="/apply" element={session ? <Apply /> : <Navigate to="/auth/login" />} />
            <Route path="/admin/dashboard" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="py-12 border-t border-white/5 bg-zinc-950/20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
              &copy; 2024 SYMPHONY NETWORK &bull; ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
