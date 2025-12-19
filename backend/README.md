# Backend Server

Express.js server with PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database in `server.js` or use environment variables:
```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'website_db',
  password: 'your_password',
  port: 5432,
});
```

3. Start server:
```bash
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT secret key
- `DB_USER` - PostgreSQL username
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_PASSWORD` - PostgreSQL password
- `DB_PORT` - PostgreSQL port

