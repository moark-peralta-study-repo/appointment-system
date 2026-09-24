# Appointment System

A MERN-stack appointment system developed as a group project.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript

### Backend

* Node.js
* Express.js
* Mongoose

### Database

* MongoDB

---

# 1. Project Structure

## EXAMPLE STRUCTURE
```text
appointment-system/
│
├── client/                         # React frontend
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │
│   │   ├── pages/                  # Application pages
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   ├── doctors/
│   │   │   └── profile/
│   │   │
│   │   ├── services/               # API calls to backend
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── context/                # Global React state
│   │   ├── utils/                  # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/                         # Node + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   │
│   │   ├── models/                 # Mongoose models
│   │   │
│   │   ├── controllers/            # HTTP request/response handling
│   │   │
│   │   ├── services/               # Business logic
│   │   │
│   │   ├── routes/                 # API endpoints
│   │   │
│   │   ├── middleware/             # Authentication, validation, errors
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
│
├── .gitignore
└── README.md
```

---

# 2. Git Workflow

Do NOT work directly on `main`.

The basic workflow is:

```text
main
 │
 ├── feature/login
 ├── feature/appointments
 ├── feature/doctor-schedule
 └── feature/database-models
```

Each task gets its own branch.

---

# 3. Before Starting Work

First clone the repository:

```bash
git clone <REPOSITORY_URL>
cd appointment-system
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

# 4. Before Starting a New Task

Always make sure your local `main` is up to date.

```bash
git switch main
git pull origin main
```

Then create a new branch:

```bash
git switch -c feature/<name>
```

Examples:

```bash
git switch -c feature/login
```

```bash
git switch -c feature/appointment-booking
```

```bash
git switch -c feature/doctor-schedule
```

---

# 5. While Working

Check what changed:

```bash
git status
```

View your changes:

```bash
git diff
```

Do not commit:

```text
node_modules/
.env
```

These are already ignored by `.gitignore`.

---

# 6. Commit Your Changes

After completing a logical piece of work:

```bash
git add .
```

Check what is staged:

```bash
git status
```

Then commit:

```bash
git commit -m "feat: add appointment booking form"
```

Use clear commit messages.

Examples:

```text
feat: add login page
feat: add appointment model
feat: add appointment API
fix: validate appointment date
fix: fix login form
docs: add database diagram
```

---

# 7. Push Your Branch

```bash
git push -u origin feature/<name>
```

For example:

```bash
git push -u origin feature/login
```

The first push creates the remote branch.

---

# 8. Create a Pull Request

After pushing your branch:

1. Open GitHub.
2. Open the repository.
3. Create a Pull Request.
4. Set:

```text
base: main
compare: your-feature-branch
```

5. Explain what you changed.
6. Ask another group member to review it.

Do not merge your own PR immediately unless the group has agreed that this is okay.

---
# 9. Running the Application

## Frontend

Open a terminal:

```bash
cd client
npm run dev
```

## Backend

Open another terminal:

```bash
cd server
npm run dev
```

Both need to be running during development.

---

# 10. Environment Variables

The backend uses:

```text
server/.env
```

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

NEVER commit `.env`.

Do not send your MongoDB password through GitHub.

If a `.env.example` file exists, use it as the template.

---

# 11. Basic Git Cheat Sheet

### Get latest changes

```bash
git switch main
git pull origin main
```

### Create a branch

```bash
git switch -c feature/my-feature
```

### See changes

```bash
git status
git diff
```

### Stage changes

```bash
git add .
```

### Commit

```bash
git commit -m "feat: describe what you did"
```

### Push

```bash
git push -u origin feature/my-feature
```

### Switch branches

```bash
git switch main
```

```bash
git switch feature/my-feature
```

### Update your branch with main

```bash
git fetch origin
git merge origin/main
```

If there are conflicts, **do not panic or delete files**. Ask for help before continuing.

---

