import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { api } from '@/lib/api';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Login] Attempt', { email });
      const data = await api.post<{ token: string; user: any }>(`/auth/login`, { email, password });
      console.log('[Login] Success', data.user);

      // Salvar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLogin(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      console.error('[Login] Error', err);
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size="large" showText={true} />
          </div>
          <h1 style={{ margin: '16px 0 8px', fontSize: '1.75rem', color: 'var(--color-text)' }}>
            Bem-vindo
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Entre com suas credenciais para acessar
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.875rem'
          }}>
            ⚠️ {error}
          </div>
        )}

  <form onSubmit={handleSubmit} method="post" action="#">
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text)'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text)'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Entrando...' : '🔐 Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: 'var(--color-primary-light)',
          borderRadius: '10px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>💡 Credenciais de teste:</p>
          <p style={{ margin: '4px 0' }}><strong>Admin:</strong> admin@abanotes.com / admin123</p>
          <p style={{ margin: '4px 0' }}><strong>Usuário:</strong> usuario@abanotes.com / user123</p>
          <p style={{ margin: '12px 0 0', fontStyle: 'italic' }}>Use /api base para chamadas internas (proxy Docker/produção)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
