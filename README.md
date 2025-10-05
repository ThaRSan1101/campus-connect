# Campus Connect — SEU Issue Tracker

Campus Connect is a lightweight issue reporting and event management system built for Southeastern University (SEU). It provides students a way to register with their @seu.ac.lk email, submit campus issue reports (with optional photos), browse events, and includes an admin section for managing users, reports and events.

Short description (for GitHub "Repository description"):

"Campus Connect — SEU Issue Tracker: PHP + MySQL backend with Bootstrap frontend for reporting campus issues and managing events."

## Table of Contents

- About
- Tech stack
- Repository structure
- Database (schema & import)
- How to run locally (XAMPP/Windows)
- API endpoints
- Frontend routes / pages
- Important files
- Security & notes
- Contributing

## About
This repository contains a project developed as part of academic coursework at Southeastern University (Faculty of Applied Sciences). It was created to demonstrate a small full-stack web application for educational purposes.

This project is intended as a small campus-focused web app. Students register using their SEU email, submit issues (with optional image evidence), and view/join campus events. Admins manage reports, events and user accounts via a separate admin UI.

## Tech stack

- Backend: PHP (PDO) — simple REST-like endpoints in `backend/`
- Database: MySQL (schema in `backend/database/campus_connect.sql`)
- Frontend: Static HTML pages + Bootstrap 5 + vanilla JavaScript in `frontend/`
- File uploads stored under `uploads/reports/`

## Repository structure

Top-level layout:

- `backend/` — PHP API endpoints and `db.php` (PDO connection)
  - `database/campus_connect.sql` — SQL schema and CREATE statements
  - `register.php`, `login.php`, `submit_report.php`, `get_reports.php`, `get_recent_reports.php`, `get_events.php`, `create_event.php`, etc.
- `frontend/` — static pages, assets and admin pages
  - `pages/` — HTML pages (index, login, register, report, events, dashboard, admin/...)
  - `assets/` — CSS, JS and images used by the frontend
- `uploads/` — uploaded files (e.g. `uploads/reports/`)

## Database (schema & import)

The database schema is provided at `backend/database/campus_connect.sql`. It creates four main tables:

- `users` — user accounts (User_ID, Name, Email, Password, role, is_active, register_date)
- `events` — event records (ID, title, date, location, Status)
- `reports` — issue reports (ID, User_ID, Location, description, type, image, issue_address_date, submitted_date, phone, Status)
- `activities` — simple activity log (id, type, description, created_at)

Import steps (using phpMyAdmin or MySQL CLI):

1. Start MySQL (e.g. via XAMPP).
2. Open phpMyAdmin or run the mysql CLI and import `backend/database/campus_connect.sql`.

## How to run locally (Windows + XAMPP)

1. Requirements:
   - XAMPP (Apache + PHP + MySQL)
   - Git (optional)
2. Put the project folder inside your web server root, e.g. `C:\xampp\htdocs\campus-connect` (looks like you already have this path).
3. Start Apache and MySQL using the XAMPP Control Panel.
4. Import the database schema `backend/database/campus_connect.sql` into MySQL:

   - Using phpMyAdmin: http://localhost/phpmyadmin → Import → choose the SQL file → Go.
   - OR using MySQL CLI (example):

```powershell
mysql -u root -p < "C:\xampp\htdocs\campus-connect\backend\database\campus_connect.sql"
```

5. Edit database credentials if needed in `backend/db.php`. By default the project expects `host=localhost`, `user=root`, `pass=` and database name `campus_connect`.
6. Ensure the uploads folder is writable by the webserver:

```powershell
# From an elevated PowerShell prompt (if needed)
cd "C:\xampp\htdocs\campus-connect"
mkdir -Force uploads\reports
icacls uploads\reports /grant "IIS_IUSRS:(OI)(CI)F" /T
# If using Apache under your user, alternatively grant your user full control
```

7. Open the app in your browser:

- Student-facing: http://localhost/campus-connect/frontend/pages/index.html
- Admin: http://localhost/campus-connect/frontend/pages/admin/admin-dashboard.html

## API endpoints (quick reference)

Most endpoints are in `backend/` and return JSON.

- POST `backend/register.php` — register user (expects JSON: {name,email,password})
- POST `backend/login.php` — login (expects JSON: {email,password}) — returns user info on success
- POST `backend/submit_report.php` — submit report (multipart/form-data, fields: user_id, location, description, issueType, timeObserved, contactInfo, optional `photo` file)
- GET `backend/get_reports.php` — list all reports (joined with user info)
- GET `backend/get_recent_reports.php` — returns latest 5 reports
- GET `backend/get_events.php` — list events
- POST `backend/create_event.php` — create a new event (form fields: title, date, location, status)
- Other admin endpoints: `delete_event.php`, `delete_report.php`, `get_users.php`, `update_user.php`, `set_user_active.php`, `set_report_status.php`

Notes: Endpoints expect requests from the frontend (relative paths are used in frontend JS). You may need to adjust the fetch URLs if you host the backend under a different path.

## Frontend pages / entrypoints

- `frontend/pages/index.html` — landing page
- `frontend/pages/register.html` — registration
- `frontend/pages/login.html` — login
- `frontend/pages/report.html` — submit report
- `frontend/pages/events.html` — list student events
- `frontend/pages/dashboard.html` — student dashboard
- `frontend/pages/admin/*` — admin dashboard and management UIs

Main JS files are in `frontend/assets/js/` and handle registration, login, report submission, and admin actions.

## Important files

- `backend/db.php` — update DB credentials here
- `backend/database/campus_connect.sql` — DB schema
- `frontend/assets/js/register.js`, `login.js`, `report.js`, `manage-reports.js`, `manage-events.js` — main client logic
- `uploads/reports/` — file uploads (images attached to reports)

## Security & notes

- Authentication is currently stateless and basic: login returns user info which the frontend stores in `localStorage`. For production, migrate to server-side sessions or JWT with proper refresh/expiration.
- No CSRF protection on forms — add CSRF tokens for POST endpoints if you make this public.
- File uploads are moved to `uploads/reports/` without deep validation — validate file MIME types and scan for malicious payloads before deploying.
- Passwords use PHP's `password_hash`, which is good. Ensure HTTPS in production.

## Contributing

If you want to contribute:

- Fork the repo and create a feature branch
- Run the app locally and test changes
- Open a PR with a concise description of the change

## Suggested GitHub topics

php, mysql, bootstrap, webapp, issue-tracker, education
