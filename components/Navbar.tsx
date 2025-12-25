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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const NavItem = ({ to, label, activeColor = "text-foreground" }: { to: string, label: string, activeColor?: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          isActive ? activeColor : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black">S</div>
            <span className="text-sm font-bold tracking-tight hidden sm:block uppercase letter-spacing-wider">{SERVER_NAME}</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="Beranda" />
            <NavItem to="/roles" label="Posisi" />
            {role === 'user' && <NavItem to="/dashboard" label="Dashboard" />}
            {role === 'admin' && <NavItem to="/admin/dashboard" label="Admin Panel" activeColor="text-white" />}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout} 
                className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">Masuk</Link>
              <Link to="/auth/signup" className="h-8 px-4 bg-white text-black rounded text-xs font-bold flex items-center hover:bg-zinc-200 transition-all">Daftar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;