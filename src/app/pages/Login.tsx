import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { user, login, isReady } = useAuth();

  useEffect(() => {
    if (isReady && user) navigate('/', { replace: true });
  }, [isReady, user, navigate]);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!usernameOrEmail.trim() || !password) {
      setError('Completa usuario/email y contraseña');
      return;
    }
    const ok = login(usernameOrEmail.trim(), password);
    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Fondo con gradiente azul suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border border-primary/20 overflow-hidden">
          <div className="bg-primary px-8 py-6 text-center">
            <h1 className="text-2xl font-bold text-primary-foreground">Tasks</h1>
            <p className="text-sm text-white/90 mt-1">Inicia sesión en tu cuenta</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-user" className="block text-sm font-medium text-foreground mb-1">
                  Usuario o correo
                </label>
                <input
                  id="login-user"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="usuario o email@ejemplo.com"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover font-medium transition-colors shadow-md"
              >
                <LogIn className="size-4" />
                Iniciar sesión
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <p>
                <Link
                  to="/recuperar-contraseña"
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  Recuperar contraseña
                </Link>
              </p>
              <p className="text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="text-primary hover:text-primary-hover font-medium">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
