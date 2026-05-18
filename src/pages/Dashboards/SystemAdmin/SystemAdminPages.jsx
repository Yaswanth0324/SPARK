import { useState } from 'react';
import { Building2, Users, Plus, X, Mail, Phone, UserCheck } from 'lucide-react';
import { getColleges, getUsers, addUser, addCollege, generateId, generateAdminId } from '../../../utils/localStorage';
import { ROLES } from '../../../utils/mockData';
import { StatCard, Modal, Badge, useToast, EmptyState, Avatar } from '../../../components/ui/UIComponents';

// ---- Colleges Page (index) ----
export const SystemAdminColleges = () => {
  const { showToast, ToastComponent } = useToast();
  const [colleges, setColleges] = useState(getColleges);
  const [selected, setSelected] = useState(null);
  const users = getUsers();

  const totalUsers = users.filter(u => u.role !== ROLES.SYSTEM_ADMIN).length;

  return (
    <div className="animate-fade-in">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Colleges</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all registered colleges</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <StatCard icon={<Building2 className="w-6 h-6" />} label="Total Colleges" value={colleges.length} color="primary" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={totalUsers} color="blue" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-700">
          <h2 className="font-semibold text-slate-800 dark:text-white">All Colleges</h2>
        </div>
        {colleges.length === 0 ? (
          <EmptyState icon={<Building2 className="w-16 h-16" />} title="No colleges yet" subtitle="Add a college admin to get started" />
        ) : (
          <table className="w-full">
            <thead><tr>
              <th className="table-th">College Name</th>
              <th className="table-th">Admin Name</th>
              <th className="table-th">Total Users</th>
              <th className="table-th">Action</th>
            </tr></thead>
            <tbody>
              {colleges.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors">
                  <td className="table-td font-medium">{c.name}</td>
                  <td className="table-td">{c.adminName}</td>
                  <td className="table-td"><Badge variant="blue">{c.totalUsers} users</Badge></td>
                  <td className="table-td">
                    <button onClick={() => setSelected(c)} className="btn-ghost text-xs py-1 px-3">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-850 rounded-xl">
              <Avatar name={selected.adminName} size="lg" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selected.adminName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.adminEmail}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['HODs', selected.hods], ['Mentors', selected.mentors], ['Students', selected.students]].map(([l, v]) => (
                <div key={l} className="text-center p-3 bg-primary-50 dark:bg-primary-950/30 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{v}</p>
                  <p className="text-xs text-slate-500 mt-1">{l}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Departments</p>
              <div className="flex flex-wrap gap-2">
                {(selected.departments || []).map(d => <Badge key={d} variant="purple">{d}</Badge>)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ---- Add College Admin Page ----
export const SystemAdminAddAdmin = () => {
  const { showToast, ToastComponent } = useToast();
  const [form, setForm] = useState({ collegeName: '', adminName: '', adminEmail: '', password: '', adminId: '' });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenId = () => set('adminId', generateAdminId());

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newAdmin = {
        id: generateId('ca'),
        role: ROLES.COLLEGE_ADMIN,
        name: form.adminName,
        email: form.adminEmail,
        password: form.password,
        college: form.collegeName,
        adminId: form.adminId,
        department: 'All',
      };
      addUser(newAdmin);
      addCollege({
        id: generateId('col'),
        name: form.collegeName,
        adminId: newAdmin.id,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        totalUsers: 1,
        hods: 0, mentors: 0, students: 0,
        departments: [],
      });
      showToast(`College admin added! Credentials "sent" to ${form.adminEmail}`, 'success', 4000);
      setForm({ collegeName: '', adminName: '', adminEmail: '', password: '', adminId: '' });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="animate-fade-in max-w-lg">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Add College Admin</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Register a new college and assign an administrator</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">College Name</label>
            <input className="input-field" placeholder="e.g. ABC Institute of Technology" value={form.collegeName} onChange={e => set('collegeName', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Admin Name</label>
            <input className="input-field" placeholder="Dr. John Doe" value={form.adminName} onChange={e => set('adminName', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Admin Email</label>
            <input type="email" className="input-field" placeholder="admin@college.edu" value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" placeholder="Set initial password" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Admin ID</label>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Auto-generate or enter manually" value={form.adminId} onChange={e => set('adminId', e.target.value)} required />
              <button type="button" onClick={handleGenId} className="btn-secondary shrink-0">Generate</button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
            {loading ? 'Adding...' : 'Add College Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};
