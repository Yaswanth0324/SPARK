# 🚀 SAPT Backend — Teammate Setup Guide

> Follow every step in order. Do NOT skip any step.
> This guide covers everything from cloning the repo to running the server.

---

## 📋 Prerequisites — Install These First

Make sure all of these are installed on your machine before starting.

| Tool | Version | Download |
|---|---|---|
| Git | Latest | https://git-scm.com/downloads |
| Java JDK | **17 or higher** | https://adoptium.net/ |
| Maven | **3.8+** | https://maven.apache.org/download.cgi |
| MySQL | **8.0+** | https://dev.mysql.com/downloads/installer/ |
| MongoDB | **6.0+** | https://www.mongodb.com/try/download/community |

### ✅ Verify Installations
Open a terminal and run these — all must show a version number:
```bash
git --version
java -version
mvn -version
mysql --version
mongod --version
```

---

## 🔁 Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/SPAT.git
cd SPAT
```

> Replace `YOUR_ORG/SPAT` with the actual GitHub repo URL your team lead shares.

---

## 🔄 Step 2 — Pull Latest Changes (Every Time You Start Work)

> **Always do this before writing any code.**

```bash
git checkout dev
git pull origin dev
```

If you are working on a feature branch:
```bash
git checkout feature/your-feature-name
git pull origin feature/your-feature-name
```

---

## 🌿 Step 3 — Create Your Feature Branch

> Never code directly on `main` or `dev`.

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

**Branch naming examples:**
```
feature/auth-login
feature/student-profile
feature/submission-create
fix/otp-expiry-bug
```

---

## 📂 Step 4 — Navigate to the Backend Folder

```bash
cd backend
```

All backend commands from this point run inside the `backend/` folder.

---

## 🗄️ Step 5 — Set Up MySQL Database

Open MySQL client (MySQL Workbench or terminal):

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE sapt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

You should see `sapt_db` in the list.

---

## 🍃 Step 6 — Start MongoDB

MongoDB must be running in the background.

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
mongod --dbpath /usr/local/var/mongodb
```

**Verify MongoDB is running:**
```bash
mongosh
# Should open the MongoDB shell. Type 'exit' to quit.
```

---

## 🔑 Step 7 — Create Your `.env` File

> `.env` is NOT committed to Git. Every teammate creates their own locally.

Inside `backend/`, copy the example file:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

Now open `.env` and fill in your values:

```properties
# App
APP_ENV=dev
SERVER_PORT=8080

# MySQL — update with your local MySQL credentials
MYSQL_URL=jdbc:mysql://localhost:3306/sapt_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
MYSQL_DATABASE=sapt_db
MYSQL_USERNAME=root
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD_HERE

# MongoDB — usually no changes needed locally
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=sapt_logs

# JWT — paste any long random string (min 32 characters)
JWT_SECRET=sapt_super_secret_key_replace_this_with_a_long_random_string_2026
JWT_EXPIRATION=86400000

# SMTP Mail — use your Gmail App Password (NOT your login password)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_16_char_app_password

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

---

## 📦 Step 8 — Install Maven Dependencies

```bash
mvn clean install -DskipTests
```

This downloads all required dependencies from Maven Central.
First time may take 2–5 minutes.

**Expected output:**
```
[INFO] BUILD SUCCESS
```

If you see `BUILD FAILURE`, check:
- Java version is 17+ (`java -version`)
- You are inside the `backend/` folder
- Your internet connection is active

---

## ▶️ Step 9 — Run the Backend Server

```bash
mvn spring-boot:run
```

**Expected output (last few lines):**
```
Started SaptApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

The API is now running at: **http://localhost:8080/api**

---

## 🧪 Step 10 — Test the Server is Running

Open a browser or Postman and hit:
```
GET http://localhost:8080/api/auth/login
```

You should get a JSON response (even if it's an error) — that means the server is alive.

Or use curl:
```bash
curl http://localhost:8080/api/auth/login
```

---

## 🔄 Daily Workflow — Do This Every Day

```bash
# 1. Go to backend
cd SPAT/backend

# 2. Pull latest changes from dev
git checkout dev
git pull origin dev

# 3. Merge latest dev into your feature branch
git checkout feature/your-feature-name
git merge dev

# 4. Resolve any merge conflicts if shown

# 5. Run the server
mvn spring-boot:run
```

---

## 💾 Saving and Pushing Your Work

```bash
# Check what files you changed
git status

# Stage your changes
git add .

# Commit with a meaningful message
git commit -m "feat(auth): implement JWT token generation"

# Push to GitHub
git push origin feature/your-feature-name
```

**Then open a Pull Request on GitHub: `feature/your-branch → dev`**

---

## ❌ Common Errors & Fixes

### Error: `Port 8080 already in use`
```bash
# Windows — find and kill the process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

---

### Error: `Access denied for user 'root'@'localhost'`
Your MySQL password in `.env` is wrong.
```bash
# Test MySQL connection manually
mysql -u root -p
# Enter your password — if this fails, reset MySQL root password
```

---

### Error: `Could not resolve dependencies` (BUILD FAILURE)
```bash
# Force re-download all dependencies
mvn clean install -U -DskipTests
```

---

### Error: `Could not connect to MongoDB`
```bash
# Windows — start MongoDB service
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

---

### Error: `JWT_SECRET must not be blank`
Your `.env` is missing or the `JWT_SECRET` is empty.
Open `.env` and make sure `JWT_SECRET` has a value (any long string).

---

### Error: `.env not found` or variables not loading
Make sure `.env` is in the `backend/` root folder (same level as `pom.xml`):
```
backend/
├── .env          ← HERE
├── pom.xml
└── src/
```

---

## 📁 Where to Write Your Code

| Your Role | Files to Edit |
|---|---|
| **Auth** | `auth/service/AuthServiceImpl.java` |
| **Student** | `student/service/StudentServiceImpl.java` + `student/controller/StudentController.java` |
| **Mentor** | `mentor/service/MentorServiceImpl.java` + `mentor/controller/MentorController.java` |
| **HOD** | `hod/service/HodServiceImpl.java` + `hod/controller/HodController.java` |
| **CollegeAdmin** | `collegeadmin/service/CollegeAdminServiceImpl.java` + controller |
| **SystemAdmin** | `systemadmin/service/SystemAdminServiceImpl.java` + controller |
| **Submission** | `submission/service/SubmissionServiceImpl.java` + controller |
| **Notification** | `notification/mail/MailService.java` + `notification/templates/MailTemplates.java` |

> Search for `TODO` comments inside any file to find exactly what to implement.

---

## ⚙️ IDE Setup (IntelliJ IDEA — Recommended)

1. Open IntelliJ → **File → Open** → select the `backend/` folder
2. IntelliJ will auto-detect the Maven project
3. Wait for indexing to finish
4. Go to **File → Project Structure → SDK** → select Java 17
5. Install the **Lombok plugin**: `Settings → Plugins → search "Lombok" → Install`
6. Enable annotation processing: `Settings → Build → Compiler → Annotation Processors → Enable`
7. Run `SaptApplication.java` using the green ▶ button

---

## 📞 Team Contacts

| Role | Contact |
|---|---|
| Team Lead / Architect | _(add name)_ |
| Auth Team | _(add name)_ |
| Student Module | _(add name)_ |
| Mentor Module | _(add name)_ |
| Submission Module | _(add name)_ |

> For architecture questions, always read `README.md` first before asking.

---

---

# 🖥️ Frontend Setup Guide

The frontend is a **React 19 + Vite + TailwindCSS** app located in the **project root** (`SPAT/`).

> The frontend and backend are separate. They run on different ports locally.
> Frontend: `http://localhost:5173`
> Backend API: `http://localhost:8080/api`

---

## 📋 Frontend Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | **18 or higher** | https://nodejs.org/en/download |
| npm | Comes with Node.js | — |

**Verify:**
```bash
node -v
npm -v
```
Both must print a version number.

---

## 📂 Step 1 — Navigate to the Frontend (Project Root)

The frontend lives in the root of the repo, NOT inside `backend/`.

```bash
# From the SPAT/ root
cd SPAT
```

Or if you're currently inside `backend/`:
```bash
cd ..
```

---

## 📦 Step 2 — Install Frontend Dependencies

```bash
npm install
```

This installs:
- React 19
- React Router DOM v7
- Recharts (charts)
- Lucide React (icons)
- Vite (build tool)
- TailwindCSS v3

**Expected output:**
```
added XXX packages in Xs
```

> If you see `npm ERR!`, delete `node_modules/` and try again:
> ```bash
> # Windows
> rmdir /s /q node_modules
> # Mac/Linux
> rm -rf node_modules
> npm install
> ```

---

## ▶️ Step 3 — Run the Frontend Dev Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open your browser at: **http://localhost:5173**

---

## 🔗 Step 4 — Connect Frontend to Your Local Backend

The frontend makes API calls to the backend. Make sure both are running simultaneously.

Check where API calls are configured:

```
SPAT/
├── src/
│   └── utils/          ← look for API base URL here
│       └── mockData.js
```

When the backend is ready, the frontend API base URL should point to:
```
http://localhost:8080/api
```

> Your backend must be running (`mvn spring-boot:run`) for API calls to work.

---

## 🔄 Daily Frontend Workflow

```bash
# Terminal 1 — Backend
cd SPAT/backend
mvn spring-boot:run

# Terminal 2 — Frontend
cd SPAT
npm run dev
```

Keep **both terminals open** while developing. They run in parallel.

---

## 📜 Available Frontend Scripts

```bash
npm run dev       # Start local development server (hot reload)
npm run build     # Build production bundle → dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint code quality checks
```

---

## 🌿 Frontend Tech Stack Reference

| Package | Purpose |
|---|---|
| `react` v19 | Core UI framework |
| `react-dom` | React DOM renderer |
| `react-router-dom` v7 | Client-side routing |
| `recharts` | Charts and data visualization |
| `lucide-react` | Icon library |
| `tailwindcss` v3 | Utility-first CSS framework |
| `vite` v8 | Fast build tool and dev server |
| `postcss` + `autoprefixer` | CSS post-processing |

---

## 📁 Frontend Folder Structure

```
SPAT/                          ← Project root = Frontend root
├── index.html                 ← HTML entry point
├── package.json               ← Frontend dependencies
├── vite.config.js             ← Vite config
├── tailwind.config.js         ← TailwindCSS config
├── vercel.json                ← Vercel deployment config
│
└── src/
    ├── main.jsx               ← React app entry point
    ├── App.jsx                ← Root component + routing setup
    ├── index.css              ← Global styles
    │
    ├── routes/                ← Route definitions
    │   ├── AppRouter.jsx
    │   └── ProtectedRoute.jsx
    │
    ├── context/               ← React context (global state)
    │   ├── AuthContext.jsx    ← Auth state (user, token, role)
    │   └── ThemeContext.jsx   ← Dark/light mode
    │
    ├── layouts/               ← Shared page layouts
    │   └── DashboardLayout.jsx
    │
    ├── components/            ← Reusable UI components
    │   ├── Navbar.jsx
    │   └── ui/UIComponents.jsx
    │
    ├── pages/                 ← Page components (one per route)
    │   ├── Home/
    │   ├── Auth/              ← LoginPage, RegisterPage
    │   └── Dashboards/
    │       ├── SystemAdmin/
    │       ├── CollegeAdmin/
    │       ├── HOD/
    │       ├── Mentor/
    │       └── Student/
    │
    └── utils/                 ← Utility functions
        ├── mockData.js        ← Placeholder data (replace with API calls)
        └── localStorage.js    ← Auth token helpers
```

---

## ❌ Common Frontend Errors & Fixes

### Error: `'vite' is not recognized` or `npm run dev` fails
```bash
# Re-install dependencies
npm install
```

### Error: `Cannot find module '...'`
```bash
npm install
```

### Error: White screen / nothing loads
- Check browser console (F12 → Console tab) for errors
- Make sure `npm run dev` is still running in the terminal

### Error: API calls fail (Network Error / CORS)
- Make sure the backend is running: `cd backend && mvn spring-boot:run`
- Check that backend is on port `8080`
- Check `ALLOWED_ORIGINS` in `backend/.env` includes `http://localhost:5173`

### Port 5173 already in use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

---

## 🔄 Pull Latest Frontend Changes

```bash
cd SPAT                     # Go to project root (frontend)
git checkout dev
git pull origin dev
npm install                 # Always run after pulling (in case new packages were added)
npm run dev
```

> Run `npm install` every time you pull — a teammate may have added new packages.

---

## 📞 Team Contacts

| Role | Contact |
|---|---|
| Team Lead / Architect | _(add name)_ |
| Auth Team | _(add name)_ |
| Student Module | _(add name)_ |
| Mentor Module | _(add name)_ |
| Submission Module | _(add name)_ |
| Frontend Team | _(add name)_ |

> For architecture questions, always read `README.md` first before asking.
