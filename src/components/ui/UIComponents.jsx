import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// ---- Toast ----
const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

export const Toast = ({ message, type = 'success', onClose }) => (
  <div className="fixed top-5 right-5 z-[100] animate-slide-up">
    <div
      className="flex items-center gap-3 rounded-2xl shadow-2xl px-5 py-4 min-w-[280px]"
      style={{
        background: 'var(--toast-bg, #fff7ed)',
        border: '1px solid rgba(234, 88, 12, 0.25)',
      }}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1" style={{ color: '#1c0f00' }}>{message}</p>
      <button onClick={onClose} style={{ color: '#92400e' }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const useToast = () => {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };
  const ToastComponent = toast
    ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    : null;
  return { showToast, ToastComponent };
};

// ---- Modal ----
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-content ${sizes[size]}`}>
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(234, 88, 12, 0.15)' }}
        >
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ---- Badge ----
export const Badge = ({ children, variant = 'purple' }) => {
  const classes = {
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    purple: 'badge-purple',
  };
  return <span className={classes[variant] || classes.purple}>{children}</span>;
};

// ---- Stars Display ----
export const StarsDisplay = ({ count, max = 5, size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7', xl: 'w-9 h-9' };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`${sizes[size]} ${i < count ? 'text-yellow-400' : 'text-orange-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// ---- Stat Card ----
export const StatCard = ({ icon, label, value, color = 'primary', trend }) => {
  const iconBg = {
    primary: { background: 'rgba(234,88,12,0.15)', color: '#ea580c' },
    green:   { background: 'rgba(5,150,105,0.15)', color: '#059669' },
    red:     { background: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
    yellow:  { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    blue:    { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  };
  const ic = iconBg[color] || iconBg.primary;
  return (
    <div className="stat-card">
      <div className="p-3 rounded-2xl" style={ic}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: '#92400e' }}>{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && <p className="text-xs text-emerald-600 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
};

// ---- Loading Spinner ----
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-orange-200 border-t-primary-600 rounded-full animate-spin`} />
  );
};

// ---- Empty State ----
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4" style={{ color: '#fdba74', opacity: 0.5 }}>{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    {subtitle && <p className="text-sm mt-1" style={{ color: '#92400e' }}>{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ---- Avatar ----
export const Avatar = ({ name, src, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary-400`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white ring-2 ring-primary-300`}>
      {initials}
    </div>
  );
};
