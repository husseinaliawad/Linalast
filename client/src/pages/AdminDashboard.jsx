import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  const loadAnalytics = async () => {
    const { data } = await api.get('/admin/analytics');
    setAnalytics(data.data);
  };

  const loadReports = async () => {
    const { data } = await api.get('/reports', { params: { status: 'open' } });
    setReports(data.data.items);
  };

  const loadUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data.data.items);
  };

  useEffect(() => {
    loadAnalytics();
    loadReports();
    loadUsers();
  }, []);

  const resolveReport = async (reportId, action) => {
    await api.put(`/reports/${reportId}/resolve`, { action, status: 'resolved' });
    loadReports();
  };

  const toggleBan = async (userId) => {
    await api.put(`/admin/users/${userId}/ban`);
    loadUsers();
  };

  return (
    <section className="admin">
      <div className="section-header">
        <h2>Admin dashboard</h2>
        <p className="muted">Moderate content, review reports, and monitor activity.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Users" value={analytics?.counts?.users || 0} />
        <StatCard label="Posts" value={analytics?.counts?.posts || 0} />
        <StatCard label="Reviews" value={analytics?.counts?.reviews || 0} />
        <StatCard label="Products" value={analytics?.counts?.products || 0} />
        <StatCard label="Orders" value={analytics?.counts?.orders || 0} />
        <StatCard label="Comments" value={analytics?.counts?.comments || 0} />
      </div>

      <div className="panel">
        <h3>Open reports</h3>
        {reports.length === 0 ? (
          <EmptyState title="No reports" subtitle="Everything looks clean right now." />
        ) : (
          reports.map((report) => (
            <div key={report._id} className="card">
              <div className="card-header">
                <strong>{report.targetType}</strong>
                <span className="chip">{report.status}</span>
              </div>
              <p className="card-body">{report.reason}</p>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => resolveReport(report._id, 'deleted')}
                >
                  Delete content
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => resolveReport(report._id, 'warned')}
                >
                  Warn user
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => resolveReport(report._id, 'none')}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="panel">
        <h3>Users</h3>
        {users.length === 0 ? (
          <EmptyState title="No users" subtitle="No user data available." />
        ) : (
          users.map((item) => (
            <div key={item._id} className="card">
              <div className="card-header">
                <strong>{item.username}</strong>
                <span className="chip">{item.role}</span>
              </div>
              <div className="card-actions">
                <span className="muted">{item.email}</span>
                <button type="button" className="btn btn-ghost" onClick={() => toggleBan(item._id)}>
                  {item.isBanned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
