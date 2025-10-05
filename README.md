# Campus Connect — SEU Issue Tracker

Campus Connect is an academic project developed for the Faculty of Applied Sciences at Southeastern University. It implements a basic issue-reporting and event-management web application intended for educational and demonstration purposes.

Repository description (one line):

Campus Connect — SEU Issue Tracker: PHP + MySQL backend with Bootstrap frontend for reporting campus issues and managing events.

## Contents

- About
- Technology
- Repository layout
- Database
- Local setup (Windows + XAMPP)
- API reference
- Frontend pages
- Key files
- Security considerations
- Contributing

## About

This project demonstrates a small full-stack web application. Core functionality includes user registration restricted to `@seu.ac.lk` addresses, report submission with optional image uploads, event listing and creation, and administrative interfaces for managing reports, events and users.

## Technology

- Backend: PHP (PDO)
- Database: MySQL
- Frontend: HTML, Bootstrap 5, Vanilla JavaScript
- File uploads: `uploads/reports/`

## Repository layout

- `backend/` — PHP endpoints and `db.php` (database connection)
  - `database/campus_connect.sql` — schema and table definitions
  - Endpoint examples: `register.php`, `login.php`, `submit_report.php`, `get_reports.php`, `get_events.php`, `create_event.php`
- `frontend/` — static pages and assets
  - `pages/` — HTML pages (index, login, register, report, events, dashboard, admin)
  - `assets/` — CSS, JS, and images
- `uploads/` — uploaded report images

## Database

The SQL schema at `backend/database/campus_connect.sql` defines the following tables:

- `users` (User_ID, Name, Email, Password, role, is_active, register_date)
- `events` (ID, title, date, location, Status)
- `reports` (ID, User_ID, Location, description, type, image, issue_address_date, submitted_date, phone, Status)
- `activities` (id, type, description, created_at)

Import the schema using phpMyAdmin or MySQL CLI.

## Local setup (Windows + XAMPP)

1. Install XAMPP (Apache, PHP, MySQL) and start Apache and MySQL.
2. Place the project in the web root, for example: `C:\xampp\htdocs\campus-connect`.
3. Import the SQL schema:

```powershell
mysql -u root -p < "C:\xampp\htdocs\campus-connect\backend\database\campus_connect.sql"
```

4. If necessary, update database credentials in `backend/db.php` (default: host=localhost, user=root, pass=, db=campus_connect).
5. Ensure the uploads directory exists and is writable by the web server:

```powershell
cd "C:\xampp\htdocs\campus-connect"
mkdir -Force uploads\reports
icacls uploads\reports /grant "IIS_IUSRS:(OI)(CI)F" /T
```

6. Open the application in a browser:

- http://localhost/campus-connect/frontend/pages/index.html (user-facing)
- http://localhost/campus-connect/frontend/pages/admin/admin-dashboard.html (admin)

## API reference (summary)

Endpoints are implemented as PHP scripts in `backend/`. Responses are JSON where applicable.

- POST `backend/register.php` — register user (expects JSON: {name, email, password})
- POST `backend/login.php` — authenticate (expects JSON: {email, password})
- POST `backend/submit_report.php` — submit report (multipart/form-data; fields include user_id, location, description, issueType, timeObserved, contactInfo, optional photo)
- GET `backend/get_reports.php` — list reports
- GET `backend/get_recent_reports.php` — latest reports
- GET `backend/get_events.php` — list events
- POST `backend/create_event.php` — create event

Additional admin endpoints are available for deleting and updating resources.

## Frontend pages

- `frontend/pages/index.html` — landing page
- `frontend/pages/register.html` — registration
- `frontend/pages/login.html` — login
- `frontend/pages/report.html` — submit report
- `frontend/pages/events.html` — events list
- `frontend/pages/dashboard.html` — student dashboard
- `frontend/pages/admin/*` — admin interfaces

Frontend scripts are located in `frontend/assets/js/` and handle client behavior and API calls.

## Key files

- `backend/db.php` — PDO connection; update credentials here
- `backend/database/campus_connect.sql` — database schema
- `frontend/assets/js/register.js`, `login.js`, `report.js`, `manage-reports.js`, `manage-events.js`
- `uploads/reports/` — storage for uploaded images

## Security considerations

- Authentication: the current implementation returns user information to the frontend and relies on `localStorage`. For production use, implement secure server-side sessions or token-based authentication.
- CSRF: POST endpoints do not implement CSRF protection. Add CSRF tokens when exposing the application publicly.
- File uploads: validate file types and size server-side and consider virus scanning.
- Transport: use HTTPS in production.

## Contributing

Contributions are accepted via pull requests. Follow standard GitHub workflow: fork, branch, commit, and submit a PR with a description of changes and any setup steps.

## Topics

php, mysql, bootstrap, webapp, issue-tracker, education
