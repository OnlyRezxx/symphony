
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
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabaseClient.auth.getSession();
      setSession(s);
      if (s) await checkRole(s.user.id);
      else {
        setLoading(false);
        const loader = document.getElementById('initial-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 500);
        }
      }
    };
    init();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) checkRole(s.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-white selection:text-black">
        <Navbar role={role} />
        <main className="flex-grow">
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
      </div>
    </Router>
  );
};

export default App;
