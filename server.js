const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Files table
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    originalname TEXT NOT NULL,
    mimetype TEXT,
    size INTEGER,
    path TEXT NOT NULL,
    uploaded_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(uploaded_by) REFERENCES users(id)
  )`);

  // Comments table
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Create default admin user (password: admin123)
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
    VALUES ('admin', 'admin@example.com', ?, 'admin')`, [adminPassword]);
}

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    cb(null, true);
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

// Routes

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        const token = jwt.sign(
          { id: this.lastID, username, role: 'user' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({ token, user: { id: this.lastID, username, email, role: 'user' } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    }
  );
});

// File upload route
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  db.run(
    'INSERT INTO files (filename, originalname, mimetype, size, path, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
    [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.file.path, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save file information' });
      }
      
      res.json({
        id: this.lastID,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        uploaded_by: req.user.id,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Get all files
app.get('/api/files', (req, res) => {
  db.all(
    `SELECT f.*, u.username as uploader_name 
     FROM files f 
     LEFT JOIN users u ON f.uploaded_by = u.id 
     ORDER BY f.created_at DESC`,
    [],
    (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch files' });
      }
      res.json(files);
    }
  );
});

// Get single file
app.get('/api/files/:id', (req, res) => {
  const fileId = req.params.id;
  
  db.get(
    `SELECT f.*, u.username as uploader_name 
     FROM files f 
     LEFT JOIN users u ON f.uploaded_by = u.id 
     WHERE f.id = ?`,
    [fileId],
    (err, file) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch file' });
      }
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json(file);
    }
  );
});

// Delete file (admin or owner)
app.delete('/api/files/:id', authenticateToken, (req, res) => {
  const fileId = req.params.id;
  
  db.get('SELECT * FROM files WHERE id = ?', [fileId], (err, file) => {
    if (err || !file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (req.user.role !== 'admin' && file.uploaded_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    const fs = require('fs');
    fs.unlink(file.path, (unlinkErr) => {
      // Continue even if file deletion fails
      db.run('DELETE FROM files WHERE id = ?', [fileId], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: 'Failed to delete file' });
        }
        res.json({ message: 'File deleted successfully' });
      });
    });
  });
});

// Comments routes
app.post('/api/files/:fileId/comments', authenticateToken, (req, res) => {
  const { content } = req.body;
  const fileId = req.params.fileId;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  db.run(
    'INSERT INTO comments (file_id, user_id, content) VALUES (?, ?, ?)',
    [fileId, req.user.id, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add comment' });
      }

      db.get(
        `SELECT c.*, u.username 
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
        [this.lastID],
        (err, comment) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch comment' });
          }
          res.json(comment);
        }
      );
    }
  );
});

app.get('/api/files/:fileId/comments', (req, res) => {
  const fileId = req.params.fileId;

  db.all(
    `SELECT c.*, u.username 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.file_id = ? 
     ORDER BY c.created_at DESC`,
    [fileId],
    (err, comments) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }
      res.json(comments);
    }
  );
});

app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  const commentId = req.params.id;

  db.get('SELECT * FROM comments WHERE id = ?', [commentId], (err, comment) => {
    if (err || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    db.run('DELETE FROM comments WHERE id = ?', [commentId], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({ error: 'Failed to delete comment' });
      }
      res.json({ message: 'Comment deleted successfully' });
    });
  });
});

// Admin routes
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC', [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(users);
  });
});

app.put('/api/admin/users/:id/role', authenticateToken, isAdmin, (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }
    res.json({ message: 'User role updated successfully' });
  });
});

app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
  const userId = req.params.id;

  if (userId == req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.get('/api/admin/stats', authenticateToken, isAdmin, (req, res) => {
  db.get('SELECT COUNT(*) as total_users FROM users', [], (err, userCount) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }

    db.get('SELECT COUNT(*) as total_files FROM files', [], (err, fileCount) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      db.get('SELECT COUNT(*) as total_comments FROM comments', [], (err, commentCount) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch stats' });
        }

        res.json({
          total_users: userCount.total_users,
          total_files: fileCount.total_files,
          total_comments: commentCount.total_comments
        });
      });
    });
  });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


