
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVER_NAME } from '../constants';
import { supabaseClient, signOut } from '../services/supabase';

interface Props {
  role: string | null;
}

const Navbar: React.FC<Props> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = supabaseClient.auth.getSession();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-bold text-white transition-all group-hover:scale-110">S</div>
          <span className="text-lg font-black tracking-tight">{SERVER_NAME}</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 text-xs font-bold rounded-md ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Beranda</Link>
          <Link to="/roles" className={`px-4 py-2 text-xs font-bold rounded-md ${location.pathname === '/roles' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>Posisi</Link>
          {role === 'admin' && (
            <Link to="/admin/dashboard" className={`px-4 py-2 text-xs font-bold rounded-md ${location.pathname === '/admin/dashboard' ? 'bg-rose-500/10 text-rose-500' : 'text-rose-400/70 hover:text-rose-400'}`}>Admin Panel</Link>
          )}
          {role === 'user' && (
            <Link to="/dashboard" className={`px-4 py-2 text-xs font-bold rounded-md ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white'}`}>Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {role ? (
            <button onClick={handleLogout} className="h-9 px-4 text-xs font-bold bg-secondary border border-border rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all">Keluar</button>
          ) : (
            <>
              <Link to="/auth/login" className="text-xs font-bold text-muted-foreground hover:text-white px-3">Masuk</Link>
              <Link to="/auth/signup" className="h-9 px-5 bg-primary text-white rounded-lg text-xs font-bold flex items-center hover:bg-primary/90 transition-all">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
