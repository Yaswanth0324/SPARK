import { useNavigate } from 'react-router-dom';
import { GraduationCap, Activity, Star, BarChart2, Trophy, Users, BookOpen, Award, ExternalLink, Code2, Network, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { isRegistered } from '../../utils/localStorage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StarsDisplay } from '../../components/ui/UIComponents';

const features = [
  { icon: <Activity className="w-7 h-7" />, title: 'Activity Tracking', desc: 'Track all academic, co-curricular and extracurricular activities in one place.', color: 'from-blue-500 to-indigo-600' },
  { icon: <Star className="w-7 h-7" />, title: 'Credits System', desc: 'Earn credits for every approved activity. Transparent and fair scoring.', color: 'from-yellow-400 to-orange-500' },
  { icon: <Users className="w-7 h-7" />, title: 'Mentor Reviews', desc: 'Get feedback and approvals from your assigned mentor instantly.', color: 'from-emerald-500 to-teal-600' },
  { icon: <BarChart2 className="w-7 h-7" />, title: 'Student Analytics', desc: 'Visual dashboards showing your performance and growth over time.', color: 'from-purple-500 to-pink-600' },
  { icon: <Trophy className="w-7 h-7" />, title: 'Leaderboards', desc: 'Compete with peers and climb the department leaderboard rankings.', color: 'from-rose-500 to-red-600' },
  { icon: <Award className="w-7 h-7" />, title: 'Achievement Stars', desc: 'Earn 1–5 stars based on total credits. Show your achievement badge.', color: 'from-amber-500 to-yellow-600' },
];

const reviews = [
  { name: 'Priya Nair', dept: 'CS Engineering, MIT', rating: 5, text: 'SAPT has transformed how I track my achievements. Getting stars for hard work is incredibly motivating!' },
  { name: 'Arjun Krishnan', dept: 'IT, VIT University', rating: 5, text: 'The dashboard is super clean. My mentor approves submissions in minutes. Love the UI.' },
  { name: 'Divya Menon', dept: 'ECE, Anna University', rating: 4, text: 'Finally a system that recognizes co-curricular work. My internship got 40 credits!' },
  { name: 'Rohan Gupta', dept: 'AI & DS, SRM', rating: 5, text: 'The leaderboard feature keeps me motivated. Reached 3 stars this semester!' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleGetStarted = () => {
    if (user) {
      navigate(`/dashboard/${user.role.toLowerCase().replace('_', '-')}`);
    } else if (isRegistered()) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  // ── Theme-dependent styles ──────────────────────────────────────────
  const pageBg = isDark
    ? 'linear-gradient(145deg, #140802 0%, #1e0d05 40%, #2a1208 70%, #140802 100%)'
    : 'linear-gradient(145deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 70%, #fff7ed 100%)';

  const headingColor  = isDark ? '#fff1e6' : '#431407';
  const bodyTextColor = isDark ? '#fde8d0' : '#7c2d12';
  const subtleColor   = isDark ? '#fdba74' : '#9a3412';
  const mutedColor    = isDark ? '#c2410c' : '#c2410c';

  const cardBg = isDark
    ? 'rgba(30,13,5,0.7)'
    : 'rgba(255,255,255,0.85)';
  const cardBorder = isDark
    ? '1px solid rgba(234,88,12,0.2)'
    : '1px solid #fed7aa';

  const sectionAltBg = isDark
    ? 'rgba(20,8,2,0.6)'
    : 'rgba(255,237,213,0.6)';

  const dividerColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(194,65,12,0.2)';

  const learnMoreStyle = isDark
    ? { border: '1px solid rgba(255,255,255,0.2)', color: '#fff1e6', background: 'rgba(255,255,255,0.08)' }
    : { border: '1px solid #c2410c', color: '#c2410c', background: 'transparent' };

  // ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: pageBg, color: headingColor }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section id="hero" className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: isDark ? 'rgba(234,88,12,0.15)' : 'rgba(234,88,12,0.08)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.12)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: isDark ? 'rgba(234,88,12,0.15)' : 'rgba(234,88,12,0.1)', color: isDark ? '#fb923c' : '#c2410c', border: `1px solid ${isDark ? 'rgba(234,88,12,0.3)' : 'rgba(194,65,12,0.3)'}` }}>
                <Star className="w-4 h-4 fill-primary-500 text-primary-500" />
                Track. Earn. Excel.
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-black leading-tight"
                style={{ color: headingColor }}>
                Student Activity
                <span className="block gradient-text">Point Tracker</span>
              </h1>

              <p className="text-lg max-w-lg leading-relaxed" style={{ color: bodyTextColor }}>
                SAPT helps students track co-curricular activities, earn credits, and showcase achievements — all in one beautiful, intelligent platform.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={handleGetStarted} className="btn-primary text-base px-8 py-3 shadow-glow-lg">
                  Get Started Free
                </button>
                <a href="#features"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition-all hover:shadow-md"
                  style={learnMoreStyle}
                  onMouseEnter={e => {
                    if (!isDark) e.currentTarget.style.background = 'rgba(194,65,12,0.08)';
                  }}
                  onMouseLeave={e => {
                    if (!isDark) e.currentTarget.style.background = 'transparent';
                  }}>
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2">
                {[['50+', 'Colleges'], ['10K+', 'Students'], ['1M+', 'Credits Awarded']].map(([val, label], i, arr) => (
                  <div key={label} className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: headingColor }}>{val}</p>
                      <p className="text-xs" style={{ color: subtleColor }}>{label}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px h-10" style={{ background: dividerColor }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="relative animate-float hidden lg:block">
              <div className="rounded-3xl p-6 shadow-2xl"
                style={{ background: cardBg, border: cardBorder, backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs" style={{ color: subtleColor }}>Student Dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[['Credits', '870'], ['Submissions', '12'], ['Approved', '9'], ['Stars', '3 ⭐']].map(([l, v]) => (
                    <div key={l} className="rounded-xl p-3"
                      style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(234,88,12,0.08)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(234,88,12,0.12)'}` }}>
                      <p className="text-xs" style={{ color: subtleColor }}>{l}</p>
                      <p className="text-xl font-bold" style={{ color: headingColor }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4"
                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(234,88,12,0.08)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(234,88,12,0.12)'}` }}>
                  <p className="text-xs mb-2" style={{ color: subtleColor }}>Recent Activity</p>
                  {['Hackathon – 45 pts', 'AWS Cert – 25 pts', 'Workshop – 12 pts'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 last:border-0"
                      style={{ borderBottom: i < 2 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(234,88,12,0.12)'}` : 'none' }}>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm" style={{ color: bodyTextColor }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm" style={{ color: subtleColor }}>Achievement</span>
                  <StarsDisplay count={3} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-24 px-4" style={{ background: sectionAltBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold" style={{ color: headingColor }}>Everything You Need</h2>
            <p className="mt-3 text-lg" style={{ color: subtleColor }}>A complete ecosystem for student achievement tracking</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className="group rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{ background: cardBg, border: cardBorder, backdropFilter: 'blur(8px)' }}>
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${f.color} mb-4 shadow-lg text-white`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: headingColor }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: bodyTextColor }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAR SYSTEM ───────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: headingColor }}>Star Achievement System</h2>
          <p className="mb-12" style={{ color: subtleColor }}>Earn credits and unlock achievement stars</p>
          <div className="grid grid-cols-5 gap-4">
            {[
              { stars: 1, credits: 100, label: 'Bronze' },
              { stars: 2, credits: 250, label: 'Silver' },
              { stars: 3, credits: 500, label: 'Gold' },
              { stars: 4, credits: 1000, label: 'Platinum' },
              { stars: 5, credits: 2000, label: 'Diamond' },
            ].map(({ stars, credits, label }) => (
              <div key={stars} className="rounded-2xl p-4 text-center transition-all hover:-translate-y-1"
                style={{ background: cardBg, border: cardBorder, backdropFilter: 'blur(8px)' }}>
                <StarsDisplay count={stars} max={stars} size="sm" />
                <p className="text-xs font-bold mt-2" style={{ color: '#f59e0b' }}>{label}</p>
                <p className="text-xs mt-1" style={{ color: subtleColor }}>{credits}+ credits</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-4" style={{ background: sectionAltBg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold" style={{ color: headingColor }}>What Students Say</h2>
            <p className="mt-3 text-lg" style={{ color: subtleColor }}>Trusted by thousands of students across India</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div key={r.name}
                className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{ background: cardBg, border: cardBorder, backdropFilter: 'blur(8px)' }}>
                <StarsDisplay count={r.rating} size="sm" />
                <p className="text-sm mt-3 mb-4 leading-relaxed" style={{ color: bodyTextColor }}>"{r.text}"</p>
                <div className="pt-3" style={{ borderTop: cardBorder }}>
                  <p className="font-semibold text-sm" style={{ color: headingColor }}>{r.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: subtleColor }}>{r.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-12 shadow-glow"
            style={{ background: cardBg, border: `1px solid rgba(234,88,12,0.3)`, backdropFilter: 'blur(12px)' }}>
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: headingColor }}>Ready to Track Your Journey?</h2>
            <p className="mb-8" style={{ color: bodyTextColor }}>Join thousands of students already using SAPT to showcase their achievements.</p>
            <button onClick={handleGetStarted} className="btn-primary text-base px-10 py-4 shadow-glow-lg text-lg">
              Get Started — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer id="contact" className="py-12 px-4" style={{ borderTop: `1px solid ${dividerColor}` }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-600 rounded-xl"><GraduationCap className="w-5 h-5 text-white" /></div>
              <span className="font-display font-bold text-xl" style={{ color: headingColor }}>SAPT</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: subtleColor }}>
              Student Activity Point Tracker — Empowering students to document, track, and celebrate their achievements.
            </p>
            <div className="flex gap-3 mt-4">
              {[ExternalLink, Code2, Network].map((Icon, i) => (
                <a key={i} href="#"
                  className="p-2 rounded-lg transition-all"
                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(234,88,12,0.08)', border: cardBorder, color: subtleColor }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ color: headingColor }}>Quick Links</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Features', 'Reviews', 'Login', 'Register'].map(l => (
                <p key={l}>
                  <a href="#" className="text-sm transition-colors hover:text-primary-500"
                    style={{ color: subtleColor }}>{l}</a>
                </p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4" style={{ color: headingColor }}>Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm" style={{ color: subtleColor }}>
                <Mail className="w-4 h-4 text-primary-500" /><span>support@sapt.edu.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: subtleColor }}>
                <Phone className="w-4 h-4 text-primary-500" /><span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: subtleColor }}>
                <MapPin className="w-4 h-4 text-primary-500" /><span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 text-center text-sm"
          style={{ borderTop: `1px solid ${dividerColor}`, color: mutedColor }}>
          © {new Date().getFullYear()} SAPT — Student Activity Point Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
