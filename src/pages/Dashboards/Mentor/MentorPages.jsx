import { useState } from 'react';
import { Users, FileText, CheckCircle, XCircle, Eye, Download, Phone, Mail } from 'lucide-react';
import { getUsers, getSubmissionsByMentor, updateSubmission, getTotalCredits } from '../../../utils/localStorage';
import { ROLES } from '../../../utils/mockData';
import { useAuth } from '../../../context/AuthContext';
import { StatCard, Modal, Badge, useToast, EmptyState, Avatar } from '../../../components/ui/UIComponents';

// ---- Students Page ----
export const MentorStudents = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const students = getUsers().filter(u => u.role === ROLES.STUDENT && u.mentorId === user.id);
  const submissions = getSubmissionsByMentor(user.id);

  const getStudentStats = (sId) => {
    const s = submissions.filter(sub => sub.studentId === sId);
    return { accepted: s.filter(x => x.status === 'approved').length, rejected: s.filter(x => x.status === 'rejected').length };
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">My Students</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{students.length} students under your mentorship</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Students" value={students.length} color="primary" />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Total Approved" value={submissions.filter(s => s.status === 'approved').length} color="green" />
        <StatCard icon={<XCircle className="w-6 h-6" />} label="Total Rejected" value={submissions.filter(s => s.status === 'rejected').length} color="red" />
      </div>

      {students.length === 0 ? (
        <div className="card"><EmptyState icon={<Users className="w-12 h-12" />} title="No students assigned" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(s => {
            const stats = getStudentStats(s.id);
            const credits = getTotalCredits(s.id);
            return (
              <div key={s.id} className="card-hover" onClick={() => setSelected(s)}>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={s.name} src={s.avatar} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.rollNo || s.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="green">✓ {stats.accepted}</Badge>
                  <Badge variant="red">✗ {stats.rejected}</Badge>
                  <Badge variant="purple">{credits} pts</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Student Details">
        {selected && (() => {
          const stats = getStudentStats(selected.id);
          const credits = getTotalCredits(selected.id);
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-850 rounded-xl">
                <Avatar name={selected.name} src={selected.avatar} size="xl" />
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{selected.name}</p>
                  <p className="text-sm text-slate-500">{selected.rollNo}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Mail className="w-4 h-4 text-primary-500" />{selected.email}</div>
                {selected.phone && <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Phone className="w-4 h-4 text-primary-500" />{selected.phone}</div>}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"><p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p><p className="text-xs text-slate-500">Approved</p></div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"><p className="text-2xl font-bold text-red-600">{stats.rejected}</p><p className="text-xs text-slate-500">Rejected</p></div>
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl"><p className="text-2xl font-bold text-primary-600">{credits}</p><p className="text-xs text-slate-500">Credits</p></div>
              </div>
              <button onClick={() => { alert('Download Logs: XLS export simulated!'); }} className="btn-secondary w-full justify-center">
                <Download className="w-4 h-4" /> Download Logs
              </button>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

// ---- Submissions Page ----
export const MentorSubmissions = () => {
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const [submissions, setSubmissions] = useState(() => getSubmissionsByMentor(user.id));
  const [reviewModal, setReviewModal] = useState(null);
  const [review, setReview] = useState({ text: '' });

  const handleAction = (id, action, submission) => {
    // Auto-assign credits from framework on approval
    const credits = action === 'approved' ? (submission?.suggestedCredits || 0) : 0;
    updateSubmission(id, { status: action, credits });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action, credits } : s));
    showToast(`Submission ${action}`, action === 'approved' ? 'success' : 'error');
  };

  const handleReview = () => {
    // Credits automatically come from the framework's suggestedCredits
    const credits = reviewModal.suggestedCredits || 0;
    updateSubmission(reviewModal.id, { review: review.text, credits, status: 'approved' });
    setSubmissions(prev => prev.map(s => s.id === reviewModal.id ? { ...s, review: review.text, credits, status: 'approved' } : s));
    showToast('Review submitted and approved!', 'success');
    setReviewModal(null);
    setReview({ text: '' });
  };

  const statusColor = { approved: 'green', rejected: 'red', pending: 'yellow' };

  return (
    <div className="animate-fade-in">
      {ToastComponent}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Submissions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review student activity submissions</p>
      </div>

      {submissions.length === 0 ? (
        <div className="card"><EmptyState icon={<FileText className="w-12 h-12" />} title="No submissions yet" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <th className="table-th">Title</th>
              <th className="table-th">Category</th>
              <th className="table-th">Achievement Type</th>
              <th className="table-th">Student</th>
              <th className="table-th">Date</th>
              <th className="table-th">Status</th>
              <th className="table-th">Actions</th>
            </tr></thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors">
                  <td className="table-td font-medium max-w-xs truncate">{s.title}</td>
                  <td className="table-td"><Badge variant="blue">{s.type}</Badge></td>
                  <td className="table-td text-xs text-slate-500 dark:text-slate-400">{s.achievementType || '–'}</td>
                  <td className="table-td">{s.studentName}</td>
                  <td className="table-td text-slate-400 text-xs">{s.date}</td>
                  <td className="table-td"><Badge variant={statusColor[s.status]}>{s.status}</Badge></td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      <button onClick={() => { setReviewModal(s); setReview({ text: s.review || '' }); }} className="btn-ghost text-xs py-1 px-2">
                        <Eye className="w-3 h-3" /> Review
                      </button>
                      {s.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(s.id, 'approved', s)} className="btn-success text-xs py-1 px-2"><CheckCircle className="w-3 h-3" /></button>
                          <button onClick={() => handleAction(s.id, 'rejected', s)} className="btn-danger text-xs py-1 px-2"><XCircle className="w-3 h-3" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!reviewModal} onClose={() => setReviewModal(null)} title="Review Submission">
        {reviewModal && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-dark-850 rounded-xl space-y-2">
              <p className="font-semibold text-slate-900 dark:text-white">{reviewModal.title}</p>
              {reviewModal.achievementType && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="blue">{reviewModal.type}</Badge>
                  <span className="text-xs text-slate-500">→</span>
                  <Badge variant="purple">{reviewModal.achievementType}</Badge>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-1">{reviewModal.description}</p>
              {reviewModal.suggestedCredits != null && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
                    ✅ Auto-awarded on approval: {reviewModal.suggestedCredits} pts
                  </span>
                </div>
              )}
              {/* Uploaded files */}
              {(reviewModal.certificateFile || reviewModal.presentationFile || reviewModal.documentFile) && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-dark-700 space-y-1">
                  <p className="text-xs font-semibold text-slate-500">Uploaded Files:</p>
                  {reviewModal.certificateFile && <p className="text-xs text-slate-600 dark:text-slate-400">📄 {reviewModal.certificateFile}</p>}
                  {reviewModal.presentationFile && <p className="text-xs text-slate-600 dark:text-slate-400">📊 {reviewModal.presentationFile}</p>}
                  {reviewModal.documentFile && <p className="text-xs text-slate-600 dark:text-slate-400">📝 {reviewModal.documentFile}</p>}
                </div>
              )}
            </div>
            <div>
              <label className="label-field">Review Comments</label>
              <textarea className="input-field h-28 resize-none" placeholder="Write your review or feedback..." value={review.text} onChange={e => setReview(r => ({ ...r, text: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleReview} className="btn-success flex-1 justify-center">Submit & Approve</button>
              <button onClick={() => { handleAction(reviewModal.id, 'rejected'); setReviewModal(null); }} className="btn-danger flex-1 justify-center">Reject</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
