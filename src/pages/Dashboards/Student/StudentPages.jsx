import { useState } from 'react';
import { UploadCloud, BookOpen, BarChart2, User, Plus, Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { addSubmission, getSubmissionsByStudent, addLog, getLogsByStudent, getTotalCredits, updateUser, generateId } from '../../../utils/localStorage';
import { ACTIVITY_TYPES, ACTIVITY_CATEGORIES, CREDIT_MAP, getStars, getAchievementBadge } from '../../../utils/mockData';
import { StatCard, Badge, useToast, EmptyState, Avatar, StarsDisplay } from '../../../components/ui/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// ---- Submission Form ----
export const StudentSubmission = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [form, setForm] = useState({
    type: '',
    achievementType: '',
    title: '',
    date: '',
    description: '',
    certificate: '',
    presentationFile: '',
    documentFile: '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Sub-types for chosen category
  const subTypes = form.type ? (ACTIVITY_CATEGORIES[form.type] || []) : [];

  // Exact points for chosen achievement type
  const exactPoints = subTypes.find(s => s.label === form.achievementType)?.points ?? null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.achievementType) { showToast('Please select an achievement type', 'warning'); return; }
    setLoading(true);
    setTimeout(() => {
      addSubmission({
        id: generateId('sub'),
        studentId: user.id,
        studentName: user.name,
        mentorId: user.mentorId || '',
        title: form.title,
        type: form.type,
        achievementType: form.achievementType,
        suggestedCredits: exactPoints,
        date: form.date,
        description: form.description,
        status: 'pending',
        credits: 0,
        review: '',
        fileUrl: form.certificate ? '#' : null,
        presentationUrl: form.presentationFile ? '#' : null,
        documentUrl: form.documentFile ? '#' : null,
        certificateFile: form.certificate,
        presentationFile: form.presentationFile,
        documentFile: form.documentFile,
        submittedAt: new Date().toISOString().split('T')[0],
      });
      showToast('Submission uploaded! Waiting for mentor review.', 'success');
      setForm({ type: '', achievementType: '', title: '', date: '', description: '', certificate: '', presentationFile: '', documentFile: '' });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Upload Submission</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Submit your activities for mentor review and credits</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ---- Activity Category ---- */}
          <div>
            <label className="label-field">Activity Category</label>
            <select
              className="select-field"
              value={form.type}
              onChange={e => { set('type', e.target.value); set('achievementType', ''); }}
              required
            >
              <option value="">Select a category</option>
              {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* ---- Achievement / Activity Type ---- */}
          {form.type && (
            <div>
              <label className="label-field">Achievement / Activity Type</label>
              <select
                className="select-field"
                value={form.achievementType}
                onChange={e => set('achievementType', e.target.value)}
                required
              >
                <option value="">Select achievement type</option>
                {subTypes.map(s => (
                  <option key={s.label} value={s.label}>
                    {s.label} — {s.points} pts
                  </option>
                ))}
              </select>


            </div>
          )}

          {/* ---- Title ---- */}
          <div>
            <label className="label-field">Activity Title</label>
            <input
              className="input-field"
              placeholder="e.g. First Prize – Smart India Hackathon 2024"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          {/* ---- Date ---- */}
          <div>
            <label className="label-field">Activity Date</label>
            <input
              type="date"
              className="input-field"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* ---- Description ---- */}
          <div>
            <label className="label-field">Description</label>
            <textarea
              className="input-field h-32 resize-none"
              placeholder="Describe your activity, achievements, and impact..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
            />
          </div>

          {/* ---- File Uploads ---- */}
          <div className="space-y-3 pt-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary-500" />
              Supporting Documents <span className="font-normal text-slate-400">(at least one recommended)</span>
            </p>

            {/* Certificate / PDF / Image */}
            <div>
              <label className="label-field text-xs">Certificate / Screenshot / PDF</label>
              <label className="flex items-center gap-3 input-field cursor-pointer hover:border-primary-400 transition-colors group">
                <FileText className="w-5 h-5 text-primary-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className={`text-sm truncate flex-1 ${form.certificate ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {form.certificate || 'Upload PDF, JPG, PNG…'}
                </span>
                {form.certificate && (
                  <span className="text-xs text-emerald-500 shrink-0">✓ Selected</span>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={e => set('certificate', e.target.files[0]?.name || '')}
                />
              </label>
            </div>

            {/* Presentation File – PPT/PPTX */}
            <div>
              <label className="label-field text-xs">
                Presentation File <span className="text-primary-500 font-medium">(PPT / PPTX)</span>
              </label>
              <label className="flex items-center gap-3 input-field cursor-pointer hover:border-primary-400 transition-colors group">
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">📊</span>
                <span className={`text-sm truncate flex-1 ${form.presentationFile ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {form.presentationFile || 'Upload PowerPoint presentation (.ppt / .pptx)…'}
                </span>
                {form.presentationFile && (
                  <span className="text-xs text-emerald-500 shrink-0">✓ Selected</span>
                )}
                <input
                  type="file"
                  accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  className="hidden"
                  onChange={e => set('presentationFile', e.target.files[0]?.name || '')}
                />
              </label>
            </div>

            {/* Word Document / Report */}
            <div>
              <label className="label-field text-xs">
                Report / Document <span className="text-primary-500 font-medium">(DOC / DOCX / PDF)</span>
              </label>
              <label className="flex items-center gap-3 input-field cursor-pointer hover:border-primary-400 transition-colors group">
                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">📝</span>
                <span className={`text-sm truncate flex-1 ${form.documentFile ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}`}>
                  {form.documentFile || 'Upload Word document or report (.doc / .docx)…'}
                </span>
                {form.documentFile && (
                  <span className="text-xs text-emerald-500 shrink-0">✓ Selected</span>
                )}
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={e => set('documentFile', e.target.files[0]?.name || '')}
                />
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
            {loading ? 'Uploading...' : <><UploadCloud className="w-5 h-5" /> Submit Activity</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// ---- Daily Logs ----
export const StudentLogs = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [logs, setLogs] = useState(() => getLogsByStudent(user.id));
  const [form, setForm] = useState({ title: '', description: '', links: '' });
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleAdd = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newLog = { id: generateId('log'), studentId: user.id, date: today, ...form };
      addLog(newLog);
      setLogs(getLogsByStudent(user.id));
      showToast('Log added!', 'success');
      setForm({ title: '', description: '', links: '' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Daily Logs</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Record your daily academic activities</p>
      </div>

      {/* Add form */}
      <div className="card mb-8">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary-500" /> Add Today's Log</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label-field">Title</label>
            <input className="input-field" placeholder="What did you do today?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label-field">Date</label>
            <input type="date" className="input-field" value={today} readOnly />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea className="input-field h-24 resize-none" placeholder="Describe what you learned or accomplished..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div>
            <label className="label-field">Reference Links (optional)</label>
            <input className="input-field" placeholder="https://..." value={form.links} onChange={e => setForm(f => ({ ...f, links: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Adding...' : 'Add Log'}
          </button>
        </form>
      </div>

      {/* Log History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-slate-800 dark:text-white">Log History ({logs.length})</h2>
        {logs.length === 0 ? (
          <div className="card"><EmptyState icon={<BookOpen className="w-12 h-12" />} title="No logs yet" subtitle="Start adding your daily activities" /></div>
        ) : logs.map(l => (
          <div key={l.id} className="card border-l-4 border-primary-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{l.title}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">{l.date}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{l.description}</p>
            {l.links && <a href={l.links} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline mt-1 block">{l.links}</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Metrics ----
export const StudentMetrics = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const submissions = getSubmissionsByStudent(user.id);
  const totalCredits = getTotalCredits(user.id);
  const stars = getStars(totalCredits);
  const badge = getAchievementBadge(stars);
  const approved = submissions.filter(s => s.status === 'approved');
  const rejected = submissions.filter(s => s.status === 'rejected');
  const pending = submissions.filter(s => s.status === 'pending');

  const statusColors = { approved: '#10b981', rejected: '#ef4444', pending: '#f59e0b' };
  const pieData = [
    { name: 'Approved', value: approved.length, color: '#10b981' },
    { name: 'Rejected', value: rejected.length, color: '#ef4444' },
    { name: 'Pending', value: pending.length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  // Credit growth chart
  const sortedApproved = [...approved].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  let cumulative = 0;
  const growthData = sortedApproved.map(s => {
    cumulative += s.credits;
    return { date: s.submittedAt?.slice(0, 7) || s.date?.slice(0, 7), credits: cumulative };
  });

  return (
    <div className="animate-fade-in">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">My Metrics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your performance and achievements</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FileText className="w-6 h-6" />} label="Total Submissions" value={submissions.length} color="primary" />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Approved" value={approved.length} color="green" />
        <StatCard icon={<XCircle className="w-6 h-6" />} label="Rejected" value={rejected.length} color="red" />
        <StatCard icon={<BarChart2 className="w-6 h-6" />} label="Total Credits" value={totalCredits} color="yellow" />
      </div>

      {/* Star achievement */}
      <div className="card mb-8 bg-gradient-to-r from-primary-600 to-accent-500 text-white border-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-100 text-sm font-medium">Achievement Level</p>
            <h2 className="font-display text-3xl font-bold mt-1">{badge}</h2>
            <p className="text-primary-100 text-sm mt-1">{totalCredits} credits earned</p>
          </div>
          <div className="text-right">
            <StarsDisplay count={stars} size="xl" />
            <p className="text-primary-100 text-xs mt-2">
              {stars < 5 ? `${[100,250,500,1000,2000][stars] - totalCredits} more for next star` : '🎉 Maximum stars!'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="card">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Credits Growth</h3>
          {growthData.length < 2 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Submit more activities to see growth</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="credits" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6, fill: '#ea580c' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Submission Status</h3>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">No submissions yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Submission Table */}
      <div className="card p-0 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-700 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">All Submissions</h3>
          <button onClick={() => alert('XLS Download simulated!')} className="btn-secondary text-xs gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        {submissions.length === 0 ? (
          <div className="p-8"><EmptyState icon={<FileText className="w-12 h-12" />} title="No submissions yet" /></div>
        ) : (
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Title</th>
              <th className="table-th">Category</th>
              <th className="table-th">Achievement Type</th>
              <th className="table-th">Status</th>
              <th className="table-th">Credits</th>
            </tr></thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-dark-700">
                  <td className="table-td font-medium text-sm">{s.title}</td>
                  <td className="table-td"><Badge variant="blue">{s.type}</Badge></td>
                  <td className="table-td text-xs text-slate-500 dark:text-slate-400">{s.achievementType || '–'}</td>
                  <td className="table-td"><Badge variant={s.status === 'approved' ? 'green' : s.status === 'rejected' ? 'red' : 'yellow'}>{s.status}</Badge></td>
                  <td className="table-td font-semibold text-primary-600 dark:text-primary-400">{s.credits || (s.suggestedCredits ? `~${s.suggestedCredits}` : '–')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ---- Profile ----
export const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [editPass, setEditPass] = useState(false);
  const [password, setPassword] = useState({ new: '', confirm: '' });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const totalCredits = getTotalCredits(user.id);
  const stars = getStars(totalCredits);
  const badge = getAchievementBadge(stars);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      updateUser(user.id, { avatar: dataUrl });
      refreshUser();
      showToast('Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = () => {
    if (password.new.length < 6) { showToast('Password min 6 chars', 'error'); return; }
    if (password.new !== password.confirm) { showToast('Passwords do not match', 'error'); return; }
    updateUser(user.id, { password: password.new });
    showToast('Password updated!', 'success');
    setEditPass(false);
    setPassword({ new: '', confirm: '' });
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and update your profile</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar name={user.name} src={avatar} size="xl" />
            <label className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow">
              <UploadCloud className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <StarsDisplay count={stars} size="md" />
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="purple">{badge}</Badge>
              <Badge variant="blue">{totalCredits} Credits</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card mb-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Profile Details</h3>
        <div className="space-y-3">
          {[
            ['Full Name', user.name],
            ['Email', user.email],
            ['College', user.college],
            ['Department', user.department],
            ['Mentor', user.mentorName || 'Not assigned'],
            ['Role', user.role],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-dark-700 last:border-0">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-32 shrink-0">{label}</span>
              <span className="text-sm text-slate-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Password Change */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Change Password</h3>
          <button onClick={() => setEditPass(!editPass)} className="btn-ghost text-sm">{editPass ? 'Cancel' : 'Change'}</button>
        </div>
        {editPass && (
          <div className="space-y-3">
            <div>
              <label className="label-field">New Password</label>
              <input type="password" className="input-field" placeholder="Min 6 characters" value={password.new} onChange={e => setPassword(p => ({ ...p, new: e.target.value }))} />
            </div>
            <div>
              <label className="label-field">Confirm Password</label>
              <input type="password" className="input-field" placeholder="Repeat password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} />
            </div>
            <button onClick={handlePasswordChange} className="btn-primary">Update Password</button>
          </div>
        )}
        {!editPass && <p className="text-sm text-slate-500 dark:text-slate-400">••••••••</p>}
      </div>
    </div>
  );
};
