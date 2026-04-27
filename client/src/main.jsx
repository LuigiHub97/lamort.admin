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

const emptyAttendance = {
  cliente_id: '',
  descricao: '',
  status: 'orcamento',
  data: '',
  valor: '',
  observacoes: '',
};

const statusOptions = [
  { value: 'orcamento', label: 'Orcamento' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('lamort_token'));
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', senha: '' });
  const [activeView, setActiveView] = useState('clientes');
  const [clients, setClients] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendance);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isLoggedIn = Boolean(token);

  const pageTitle = useMemo(() => {
    return authMode === 'login' ? 'Entrar no painel' : 'Criar acesso';
  }, [authMode]);

  const filteredAttendances = useMemo(() => {
    if (attendanceFilter === 'todos') {
      return attendances;
    }

    return attendances.filter((attendance) => attendance.status === attendanceFilter);
  }, [attendances, attendanceFilter]);

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [clientsResponse, attendancesResponse] = await Promise.all([
        api.get('/clientes'),
        api.get('/atendimentos'),
      ]);

      setClients(clientsResponse.data);
      setAttendances(attendancesResponse.data);
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao carregar dados.');
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

  const loadAttendances = async () => {
    setLoading(true);

    try {
      const response = await api.get('/atendimentos');
      setAttendances(response.data);
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao carregar atendimentos.');
    } finally {
      setLoading(false);
    }
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

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingClientId) {
        await api.put(`/clientes/${editingClientId}`, clientForm);
        showMessage('Cliente atualizado.');
      } else {
        await api.post('/clientes', clientForm);
        showMessage('Cliente cadastrado.');
      }

      setClientForm(emptyClient);
      setEditingClientId(null);
      await loadClients();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao salvar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...attendanceForm,
      cliente_id: Number(attendanceForm.cliente_id),
      valor: attendanceForm.valor === '' ? null : Number(attendanceForm.valor),
      data: attendanceForm.data || null,
    };

    try {
      if (editingAttendanceId) {
        await api.put(`/atendimentos/${editingAttendanceId}`, payload);
        showMessage('Atendimento atualizado.');
      } else {
        await api.post('/atendimentos', payload);
        showMessage('Atendimento cadastrado.');
      }

      setAttendanceForm(emptyAttendance);
      setEditingAttendanceId(null);
      await loadAttendances();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao salvar atendimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClientId(client.id);
    setClientForm({
      nome: client.nome || '',
      telefone: client.telefone || '',
      instagram: client.instagram || '',
      observacoes: client.observacoes || '',
    });
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendanceId(attendance.id);
    setAttendanceForm({
      cliente_id: String(attendance.cliente_id || ''),
      descricao: attendance.descricao || '',
      status: attendance.status || 'orcamento',
      data: attendance.data ? attendance.data.slice(0, 10) : '',
      valor: attendance.valor || '',
      observacoes: attendance.observacoes || '',
    });
  };

  const handleDeleteClient = async (id) => {
    setLoading(true);

    try {
      await api.delete(`/clientes/${id}`);
      showMessage('Cliente removido.');
      await loadDashboardData();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao remover cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendance = async (id) => {
    setLoading(true);

    try {
      await api.delete(`/atendimentos/${id}`);
      showMessage('Atendimento removido.');
      await loadAttendances();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Erro ao remover atendimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lamort_token');
    setToken(null);
    setClients([]);
    setAttendances([]);
    setActiveView('clientes');
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return 'Sem valor';
    }

    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const statusLabel = (status) => {
    return statusOptions.find((option) => option.value === status)?.label || status;
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
          <h1>{activeView === 'clientes' ? 'Clientes' : 'Atendimentos'}</h1>
        </div>

        <div className="header-actions">
          <nav className="tabs" aria-label="Navegacao do painel">
            <button
              type="button"
              className={activeView === 'clientes' ? 'tab active' : 'tab'}
              onClick={() => setActiveView('clientes')}
            >
              Clientes
            </button>
            <button
              type="button"
              className={activeView === 'atendimentos' ? 'tab active' : 'tab'}
              onClick={() => setActiveView('atendimentos')}
            >
              Atendimentos
            </button>
          </nav>

          <button type="button" className="secondary" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {message && <p className="message dashboard-message">{message}</p>}

      {activeView === 'clientes' ? (
        <section className="content-grid">
          <form onSubmit={handleClientSubmit} className="panel stack">
            <h2>{editingClientId ? 'Editar cliente' : 'Novo cliente'}</h2>

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
                {editingClientId ? 'Salvar' : 'Cadastrar'}
              </button>

              {editingClientId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingClientId(null);
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

            <div className="item-list">
              {clients.length === 0 && <p className="empty">Nenhum cliente cadastrado.</p>}

              {clients.map((client) => (
                <article className="list-item" key={client.id}>
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
      ) : (
        <section className="content-grid">
          <form onSubmit={handleAttendanceSubmit} className="panel stack">
            <h2>{editingAttendanceId ? 'Editar atendimento' : 'Novo atendimento'}</h2>

            <label>
              Cliente
              <select
                value={attendanceForm.cliente_id}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, cliente_id: event.target.value })}
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Descricao
              <textarea
                value={attendanceForm.descricao}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, descricao: event.target.value })}
                rows="4"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Status
                <select
                  value={attendanceForm.status}
                  onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value })}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Data
                <input
                  type="date"
                  value={attendanceForm.data}
                  onChange={(event) => setAttendanceForm({ ...attendanceForm, data: event.target.value })}
                />
              </label>
            </div>

            <label>
              Valor
              <input
                type="number"
                min="0"
                step="0.01"
                value={attendanceForm.valor}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, valor: event.target.value })}
              />
            </label>

            <label>
              Observacoes
              <textarea
                value={attendanceForm.observacoes}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, observacoes: event.target.value })}
                rows="3"
              />
            </label>

            <div className="actions">
              <button type="submit" disabled={loading || clients.length === 0}>
                {editingAttendanceId ? 'Salvar' : 'Cadastrar'}
              </button>

              {editingAttendanceId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingAttendanceId(null);
                    setAttendanceForm(emptyAttendance);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>

            {clients.length === 0 && <p className="empty">Cadastre um cliente antes de criar atendimento.</p>}
          </form>

          <section className="panel">
            <div className="list-header">
              <h2>Lista de atendimentos</h2>
              <button type="button" className="secondary" onClick={loadAttendances} disabled={loading}>
                Atualizar
              </button>
            </div>

            <div className="filters">
              <button
                type="button"
                className={attendanceFilter === 'todos' ? 'filter active' : 'filter'}
                onClick={() => setAttendanceFilter('todos')}
              >
                Todos
              </button>
              {statusOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={attendanceFilter === option.value ? 'filter active' : 'filter'}
                  onClick={() => setAttendanceFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="item-list">
              {filteredAttendances.length === 0 && <p className="empty">Nenhum atendimento encontrado.</p>}

              {filteredAttendances.map((attendance) => (
                <article className="list-item" key={attendance.id}>
                  <div className="attendance-info">
                    <div className="item-title-row">
                      <h3>{attendance.cliente_nome || 'Cliente'}</h3>
                      <span className={`status-pill ${attendance.status}`}>{statusLabel(attendance.status)}</span>
                    </div>
                    <p>{attendance.descricao}</p>
                    <p>
                      {attendance.data ? attendance.data.slice(0, 10).split('-').reverse().join('/') : 'Sem data'} ·{' '}
                      {formatCurrency(attendance.valor)}
                    </p>
                  </div>

                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => handleEditAttendance(attendance)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => handleDeleteAttendance(attendance.id)}>
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
