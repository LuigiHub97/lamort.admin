import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import api from './api.js';
import './styles.css';

const emptyClient = {
  nome: '',
  telefone: '',
  instagram: '',
  observacoes: '',
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('lamort_token'));
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', senha: '' });
  const [clients, setClients] = useState([]);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isLoggedIn = Boolean(token);

  const pageTitle = useMemo(() => {
    return authMode === 'login' ? 'Entrar no painel' : 'Criar acesso';
  }, [authMode]);

  useEffect(() => {
    if (isLoggedIn) {
      loadClients();
    }
  }, [isLoggedIn]);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'register') {
        await api.post('/auth/register', authForm);
        setAuthMode('login');
        showMessage('Cadastro criado. Agora faca login.');
        return;
      }

      const response = await api.post('/auth/login', authForm);
      localStorage.setItem('lamort_token', response.data.token);
      setToken(response.data.token);
      showMessage('Login feito.');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Nao foi possivel continuar.');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    setLoading(true);

    try {
      const response = await api.get('/clientes');
      setClients(response.data);
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, clientForm);
        showMessage('Cliente atualizado.');
      } else {
        await api.post('/clientes', clientForm);
        showMessage('Cliente cadastrado.');
      }

      setClientForm(emptyClient);
      setEditingId(null);
      await loadClients();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao salvar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingId(client.id);
    setClientForm({
      nome: client.nome || '',
      telefone: client.telefone || '',
      instagram: client.instagram || '',
      observacoes: client.observacoes || '',
    });
  };

  const handleDeleteClient = async (id) => {
    setLoading(true);

    try {
      await api.delete(`/clientes/${id}`);
      showMessage('Cliente removido.');
      await loadClients();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao remover cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lamort_token');
    setToken(null);
    setClients([]);
  };

  if (!isLoggedIn) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div>
            <p className="eyebrow">Lamort Admin</p>
            <h1>{pageTitle}</h1>
          </div>

          <form onSubmit={handleAuthSubmit} className="stack">
            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={authForm.senha}
                onChange={(event) => setAuthForm({ ...authForm, senha: event.target.value })}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <button
            type="button"
            className="link-button"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Criar uma conta' : 'Ja tenho conta'}
          </button>

          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Lamort Admin</p>
          <h1>Clientes</h1>
        </div>

        <button type="button" className="secondary" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {message && <p className="message">{message}</p>}

      <section className="content-grid">
        <form onSubmit={handleClientSubmit} className="panel stack">
          <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>

          <label>
            Nome
            <input
              value={clientForm.nome}
              onChange={(event) => setClientForm({ ...clientForm, nome: event.target.value })}
              required
            />
          </label>

          <label>
            Telefone
            <input
              value={clientForm.telefone}
              onChange={(event) => setClientForm({ ...clientForm, telefone: event.target.value })}
            />
          </label>

          <label>
            Instagram
            <input
              value={clientForm.instagram}
              onChange={(event) => setClientForm({ ...clientForm, instagram: event.target.value })}
            />
          </label>

          <label>
            Observacoes
            <textarea
              value={clientForm.observacoes}
              onChange={(event) => setClientForm({ ...clientForm, observacoes: event.target.value })}
              rows="4"
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {editingId ? 'Salvar' : 'Cadastrar'}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setClientForm(emptyClient);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="panel">
          <div className="list-header">
            <h2>Lista de clientes</h2>
            <button type="button" className="secondary" onClick={loadClients} disabled={loading}>
              Atualizar
            </button>
          </div>

          <div className="client-list">
            {clients.length === 0 && <p className="empty">Nenhum cliente cadastrado.</p>}

            {clients.map((client) => (
              <article className="client-item" key={client.id}>
                <div>
                  <h3>{client.nome}</h3>
                  <p>{client.telefone || 'Sem telefone'}</p>
                  <p>{client.instagram || 'Sem instagram'}</p>
                </div>

                <div className="actions">
                  <button type="button" className="secondary" onClick={() => handleEditClient(client)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => handleDeleteClient(client.id)}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
