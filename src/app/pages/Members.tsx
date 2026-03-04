import { useState } from 'react';
import { Navigate } from 'react-router';
import { UserCircle, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Users } from './Users';
import { Groups } from './Groups';

export function Members() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="size-full flex flex-col bg-background">
      {/* Header azul */}
      <div className="bg-primary border-b border-primary/30 px-8 py-6 shadow-md">
        <h2 className="text-2xl font-bold text-primary-foreground">Miembros</h2>
        <p className="text-sm text-white/90 mt-1">Gestiona usuarios y grupos del sistema</p>
        
        <div className="flex gap-1 mt-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 -mb-px transition-colors ${
              activeTab === 'users'
                ? 'border-primary-foreground text-primary-foreground font-medium'
                : 'border-transparent text-white/80 hover:text-white'
            }`}
          >
            <UserCircle className="size-4" />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 -mb-px transition-colors ${
              activeTab === 'groups'
                ? 'border-primary-foreground text-primary-foreground font-medium'
                : 'border-transparent text-white/80 hover:text-white'
            }`}
          >
            <UsersIcon className="size-4" />
            Grupos
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'users' ? <Users /> : <Groups />}
      </div>
    </div>
  );
}
