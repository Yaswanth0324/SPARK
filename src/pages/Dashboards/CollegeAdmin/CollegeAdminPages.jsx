import { useState } from 'react';
import { BookOpen, Users, CheckSquare, X, Check } from 'lucide-react';
import { getUsers, updateUser } from '../../../utils/localStorage';
import { ROLES } from '../../../utils/mockData';
import { useAuth } from '../../../context/AuthContext';
import { StatCard, Modal, Badge, useToast, EmptyState, Avatar } from '../../../components/ui/UIComponents';

// ---- Departments Page ----
export const CollegeAdminDepartments = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const users = getUsers().filter(u => u.college === user.college);
  const hods = users.filter(u => u.role === ROLES.HOD && u.status === 'approved');
  const mentors = users.filter(u => u.role === ROLES.MENTOR && u.status === 'approved');
  const students = users.filter(u => u.role === ROLES.STUDENT);

  // Group by department
  const deptMap = {};
  hods.forEach(h => {
    if (!deptMap[h.department]) deptMap[h.department] = { hod: null, mentors: 0, students: 0 };
    deptMap[h.department].hod = h;
  });
  mentors.forEach(m => { if (deptMap[m.department]) deptMap[m.department].mentors++; });
  students.forEach(s => { if (deptMap[s.department]) deptMap[s.department].students++; });

  const departments = Object.entries(deptMap);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Departments</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{user.college}</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<BookOpen className="w-6 h-6" />} label="Departments" value={departments.length} color="primary" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={users.length} color="blue" />
        <StatCard icon={<CheckSquare className="w-6 h-6" />} label="Pending Approvals" value={users.filter(u => u.status === 'pending').length} color="yellow" />
      </div>

      {departments.length === 0 ? (
        <div className="card"><EmptyState icon={<BookOpen className="w-12 h-12" />} title="No departments yet" subtitle="Departments appear once HODs are approved" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(([dept, info]) => (
            <div key={dept} className="card-hover" onClick={() => setSelected({ dept, ...info })}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <Badge variant="green">Active</Badge>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 leading-snug">{dept}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">HOD: {info.hod?.name || 'Unassigned'}</p>
              <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{info.mentors} Mentors</span>
                <span>·</span>
                <span>{info.students} Students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.dept || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-850 rounded-xl">
              <Avatar name={selected.hod?.name} size="lg" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selected.hod?.name}</p>
                <p className="text-sm text-slate-500">{selected.hod?.email}</p>
                <p className="text-sm text-slate-500">{selected.hod?.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{selected.mentors}</p>
                <p className="text-xs text-slate-500 mt-1">Mentors</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{selected.students}</p>
                <p className="text-xs text-slate-500 mt-1">Students</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ---- HOD Requests Page ----
export const CollegeAdminHODRequests = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [users, setUsers] = useState(() => getUsers().filter(u => u.role === ROLES.HOD && u.college === user.college));

  const handleAction = (id, action) => {
    updateUser(id, { status: action });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: action } : u));
    showToast(`HOD ${action === 'approved' ? 'approved' : 'rejected'} successfully`, action === 'approved' ? 'success' : 'error');
  };

  const pending = users.filter(u => u.status === 'pending');
  const processed = users.filter(u => u.status !== 'pending');

  return (
    <div className="animate-fade-in">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">HOD Requests</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve HOD registrations</p>
      </div>

      {pending.length === 0 && <div className="card mb-6"><EmptyState icon={<CheckSquare className="w-12 h-12" />} title="No pending requests" subtitle="All HOD requests have been processed" /></div>}

      {pending.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="font-semibold text-slate-800 dark:text-white">Pending ({pending.length})</h2>
          {pending.map(h => (
            <div key={h.id} className="card flex items-center gap-4">
              <Avatar name={h.name} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{h.name}</p>
                <p className="text-sm text-slate-500">{h.email} · {h.department}</p>
              </div>
              <Badge variant="yellow">Pending</Badge>
              <div className="flex gap-2">
                <button onClick={() => handleAction(h.id, 'approved')} className="btn-success"><Check className="w-4 h-4" /></button>
                <button onClick={() => handleAction(h.id, 'rejected')} className="btn-danger"><X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {processed.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Processed</h2>
          {processed.map(h => (
            <div key={h.id} className="card flex items-center gap-4 opacity-75">
              <Avatar name={h.name} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{h.name}</p>
                <p className="text-sm text-slate-500">{h.email}</p>
              </div>
              <Badge variant={h.status === 'approved' ? 'green' : 'red'}>{h.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
