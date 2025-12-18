# Full-Stack Website with File Upload, Comments & Admin Panel

A modern, full-stack web application with user authentication, file upload functionality, comments system, and comprehensive admin panel.

## Features

- ✅ **User Authentication** - Register and login system with JWT tokens
- ✅ **File Upload** - Upload and manage files with drag & drop support
- ✅ **Comments System** - Users can comment on uploaded files
- ✅ **Admin Panel** - Complete administration dashboard with:
  - User management (view, update roles, delete)
  - File management (view all files, delete)
  - Statistics dashboard
- ✅ **Modern UI** - Beautiful, responsive design
- ✅ **Secure** - Password hashing with bcrypt, JWT authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite Database
- Multer (File upload)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)

### Frontend
- Vanilla JavaScript (ES6+)
- Modern CSS with CSS Variables
- Responsive Design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```
   (Requires nodemon: `npm install -g nodemon`)

3. **Access the Application**
   - Open your browser and navigate to: `http://localhost:3000`

## Default Admin Account

After starting the server, a default admin account is created:

- **Username:** `admin`
- **Password:** `admin123`

**⚠️ Important:** Change the default admin password in production!

## Project Structure

```
website/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── database.db            # SQLite database (created automatically)
├── uploads/               # Uploaded files directory (created automatically)
├── public/                # Frontend files
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styles
│   └── script.js         # Frontend JavaScript
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Files
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get single file
- `POST /api/upload` - Upload a file (requires auth)
- `DELETE /api/files/:id` - Delete a file (requires auth, admin or owner)

### Comments
- `GET /api/files/:fileId/comments` - Get comments for a file
- `POST /api/files/:fileId/comments` - Add a comment (requires auth)
- `DELETE /api/comments/:id` - Delete a comment (requires auth, admin or owner)

### Admin (requires admin role)
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete a user

## Usage Guide

### For Regular Users

1. **Register/Login**
   - Click "Register" to create a new account
   - Or click "Login" if you already have an account

2. **Upload Files**
   - Once logged in, go to the "Files" section
   - Click "Choose a file" or drag and drop a file
   - Click "Upload File" to submit

3. **View Files**
   - Browse all uploaded files in the Files section
   - Click "View" to download a file
   - Click "Comments" to view file details and comments

4. **Add Comments**
   - Open a file's comments section
   - Type your comment and click "Post Comment"

### For Admins

1. **Access Admin Panel**
   - Login with an admin account
   - Click "Admin" in the navigation menu

2. **Manage Users**
   - View all registered users
   - Change user roles (User/Admin)
   - Delete users (cannot delete yourself)

3. **Manage Files**
   - View all uploaded files
   - Delete any file

4. **View Statistics**
   - See total users, files, and comments on the dashboard

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- File uploads are limited to 50MB
- Only admins and file owners can delete files
- Only admins and comment authors can delete comments
- SQL injection protection via parameterized queries

## Environment Variables (Optional)

You can set these environment variables:

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (default: 'your-secret-key-change-in-production')

Example:
```bash
PORT=8080 JWT_SECRET=my-secret-key npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it:
```bash
PORT=3001 npm start
```

### Database Issues
If you encounter database errors, delete `database.db` and restart the server (it will be recreated).

### File Upload Fails
- Ensure the `uploads/` directory exists and has write permissions
- Check file size (max 50MB)
- Verify you're logged in

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.


