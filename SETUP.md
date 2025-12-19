# Setup Guide - Backend & Frontend

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

1. Install PostgreSQL if you haven't already
2. Create the database:
```sql
CREATE DATABASE website_db;
```

3. Update database credentials in `backend/server.js` (lines 17-22):
```javascript
const pool = new Pool({
  user: 'postgres',        // Your PostgreSQL username
  host: 'localhost',
  database: 'website_db',  // Database name
  password: '1234',        // Your PostgreSQL password
  port: 5432,
});
```

### 3. Start the Server

From the `backend` directory:

```bash
cd backend
npm start
```

**Or using cmd (to avoid PowerShell execution policy):**
```bash
cd backend
cmd /c npm start
```

### 4. Access the Application

Open your browser: `http://localhost:3000`

## Default Admin Login

- **Username:** `admin`
- **Password:** `admin123`

## Project Structure

```
website/
├── backend/              # Backend server
│   ├── server.js        # Express server
│   ├── package.json     # Dependencies
│   └── uploads/         # Uploaded files
│
└── frontend/            # Frontend files
    ├── index.html       # Main page
    ├── styles.css       # Styles
    └── script.js        # JavaScript
```

## Troubleshooting

### PowerShell Execution Policy Error

If you see "cannot be loaded because running scripts is disabled":

**Option 1:** Use cmd instead:
```bash
cmd /c npm start
```

**Option 2:** Fix PowerShell policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database Connection Error

If you see database connection errors:

1. Check PostgreSQL is running
2. Verify database exists: `CREATE DATABASE website_db;`
3. Check credentials in `backend/server.js`
4. Verify PostgreSQL is listening on port 5432

### Port Already in Use

Change the port:
```bash
PORT=3001 npm start
```

