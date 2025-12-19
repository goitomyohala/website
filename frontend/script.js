// ============================================
// API Configuration
// ============================================

const API_BASE = '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// ============================================
// Authentication Functions
// ============================================

function setAuth(token, user) {
    authToken = token;
    currentUser = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUI();
}

function clearAuth() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateUI();
}

function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    };
}

// ============================================
// Navigation Menu Toggle
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ============================================
// Navbar Scroll Effect
// ============================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Active Navigation Link on Scroll
// ============================================

const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Update UI Based on Auth State
// ============================================

function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    const adminLink = document.getElementById('adminLink');
    const uploadSection = document.getElementById('uploadSection');
    const adminSection = document.getElementById('admin');

    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userGreeting) {
            userGreeting.style.display = 'block';
            userGreeting.textContent = `Hello, ${currentUser.username}`;
        }
        if (uploadSection) uploadSection.style.display = 'block';
        
        if (currentUser.role === 'admin') {
            if (adminLink) adminLink.style.display = 'inline-block';
            if (adminSection) adminSection.style.display = 'block';
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userGreeting) userGreeting.style.display = 'none';
        if (uploadSection) uploadSection.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (adminSection) adminSection.style.display = 'none';
    }
}

// ============================================
// Modal Functions
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

// ============================================
// Authentication Handlers
// ============================================

document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));
document.getElementById('registerBtn')?.addEventListener('click', () => openModal('registerModal'));
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearAuth();
    loadFiles();
    showNotification('Logged out successfully', 'success');
});

// Password visibility toggle functionality
function setupPasswordToggle(toggleId, passwordId) {
    const toggleBtn = document.getElementById(toggleId);
    const passwordInput = document.getElementById(passwordId);
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon visibility
            const eyeIcon = toggleBtn.querySelector('.eye-icon');
            const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');
            
            if (type === 'text') {
                eyeIcon.style.display = 'none';
                eyeOffIcon.style.display = 'block';
            } else {
                eyeIcon.style.display = 'block';
                eyeOffIcon.style.display = 'none';
            }
        });
    }
}

// Initialize password toggles
setupPasswordToggle('toggleLoginPassword', 'loginPassword');
setupPasswordToggle('toggleRegisterPassword', 'registerPassword');

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginError = document.getElementById('loginError');
    loginError.textContent = ''; // Clear previous errors
    
    const formData = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value
    };

    // Validate input
    if (!formData.username || !formData.password) {
        loginError.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Check if response is ok before trying to parse JSON
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            loginError.textContent = 'Server error. Please check if the server is running.';
            return;
        }

        if (response.ok) {
            setAuth(data.token, data.user);
            closeModal('loginModal');
            document.getElementById('loginForm').reset();
            loginError.textContent = '';
            loadFiles();
            if (currentUser.role === 'admin') {
                loadAdminData();
            }
            showNotification('Logged in successfully!', 'success');
        } else {
            loginError.textContent = data.error || 'Invalid username or password.';
        }
    } catch (error) {
        // Better error messages for different error types
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            loginError.textContent = 'Cannot connect to server. Please check your internet connection and ensure the server is running.';
        } else {
            loginError.textContent = 'An error occurred. Please try again.';
        }
        console.error('Login error:', error);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const registerError = document.getElementById('registerError');
    registerError.textContent = ''; // Clear previous errors
    
    const formData = {
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
    };

    // Validate input
    if (!formData.username || !formData.email || !formData.password) {
        registerError.textContent = 'Please fill in all fields.';
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        registerError.textContent = 'Please enter a valid email address.';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Check if response is ok before trying to parse JSON
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            registerError.textContent = 'Server error. Please check if the server is running.';
            return;
        }

        if (response.ok) {
            setAuth(data.token, data.user);
            closeModal('registerModal');
            document.getElementById('registerForm').reset();
            registerError.textContent = '';
            loadFiles();
            showNotification('Registered successfully!', 'success');
        } else {
            registerError.textContent = data.error || 'Registration failed. Please try again.';
        }
    } catch (error) {
        // Better error messages for different error types
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            registerError.textContent = 'Cannot connect to server. Please check your internet connection and ensure the server is running.';
        } else {
            registerError.textContent = 'An error occurred. Please try again.';
        }
        console.error('Registration error:', error);
    }
});

// ============================================
// File Upload
// ============================================

// Initialize file upload functionality - called after DOM loads
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileInputLabel = document.getElementById('fileInputLabel') || document.querySelector('.file-input-label');
    const uploadForm = document.getElementById('uploadForm');
    
    if (!fileInput) return;

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('filePreview');
        const text = document.getElementById('fileInputText');
        
        if (file) {
            text.textContent = file.name;
            preview.innerHTML = `<div class="file-info">
                <strong>${escapeHtml(file.name)}</strong> (${formatFileSize(file.size)})
            </div>`;
        } else {
            text.textContent = 'Choose a file or drag it here';
            preview.innerHTML = '';
        }
    });

    // Drag and drop functionality
    if (fileInputLabel) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInputLabel.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        fileInputLabel.addEventListener(eventName, () => {
            fileInputLabel.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInputLabel.addEventListener(eventName, () => {
            fileInputLabel.classList.remove('drag-over');
        }, false);
    });

    // Handle dropped files
    fileInputLabel.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            
            // Use DataTransfer API to set files (works in modern browsers)
            try {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                
                // Update preview
                const preview = document.getElementById('filePreview');
                const text = document.getElementById('fileInputText');
                text.textContent = file.name;
                preview.innerHTML = `<div class="file-info">
                    <strong>${escapeHtml(file.name)}</strong> (${formatFileSize(file.size)})
                </div>`;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            } catch (err) {
                console.error('Error handling dropped file:', err);
                // Fallback: show the file info even if we can't set it directly
                const preview = document.getElementById('filePreview');
                const text = document.getElementById('fileInputText');
                text.textContent = file.name + ' (Please click to select file)';
                preview.innerHTML = `<div class="file-info">
                    <strong>${escapeHtml(file.name)}</strong> (${formatFileSize(file.size)})
                    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem;">
                        File detected. Please click "Choose a file" to select it.
                    </p>
                </div>`;
            }
        }
    }, false);
    }

    // Upload form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
    if (!authToken) {
        showNotification('Please login to upload files', 'error');
        openModal('loginModal');
        return;
    }

    const fileInput = document.getElementById('fileInput');
    const uploadBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = uploadBtn.innerHTML;
    
    if (!fileInput || !fileInput.files[0]) {
        showNotification('Please select a file to upload', 'error');
        return;
    }

    const file = fileInput.files[0];
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        showNotification('File size exceeds 50MB limit. Please choose a smaller file.', 'error');
        return;
    }

    // Show upload progress
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<span>Uploading...</span>';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`
                // Don't set Content-Type header - browser will set it with boundary for FormData
            },
            body: formData
        });

        // Check if response is ok before trying to parse JSON
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalBtnText;
            showNotification('Server error. Please check if the server is running.', 'error');
            return;
        }

        if (response.ok) {
            showNotification('File uploaded successfully!', 'success');
            document.getElementById('uploadForm').reset();
            document.getElementById('filePreview').innerHTML = '';
            document.getElementById('fileInputText').textContent = 'Choose a file or drag it here';
            loadFiles();
        } else {
            showNotification(data.error || 'Upload failed. Please try again.', 'error');
        }
    } catch (error) {
        // Better error messages
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showNotification('Cannot connect to server. Please check your internet connection and ensure the server is running.', 'error');
        } else {
            showNotification('An error occurred during upload. Please try again.', 'error');
        }
        console.error('Upload error:', error);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalBtnText;
    }
        });
    }
}

// ============================================
// Load and Display Files
// ============================================

async function loadFiles() {
    const gallery = document.getElementById('filesGallery');
    if (!gallery) return;

    gallery.innerHTML = '<div class="loading">Loading files...</div>';

    try {
        const response = await fetch(`${API_BASE}/files`);
        
        // Check if response is ok before trying to parse JSON
        let files;
        try {
            files = await response.json();
        } catch (parseError) {
            gallery.innerHTML = '<div class="error">Server error. Please check if the server is running at <strong>http://localhost:3000</strong></div>';
            console.error('Error parsing files response:', parseError);
            return;
        }

        // Check if response was successful
        if (!response.ok) {
            gallery.innerHTML = `<div class="error">Error loading files: ${files.error || 'Unknown error'}</div>`;
            return;
        }

        // Check if files array is valid
        if (!Array.isArray(files)) {
            gallery.innerHTML = '<div class="error">Invalid response from server. Please try again.</div>';
            return;
        }

        if (files.length === 0) {
            gallery.innerHTML = '<div class="no-files">No files uploaded yet. Be the first to upload a file!</div>';
            return;
        }

        gallery.innerHTML = '';
        files.forEach(file => {
            const fileCard = createFileCard(file);
            gallery.appendChild(fileCard);
        });
    } catch (error) {
        // Better error messages for different error types
        let errorMessage = 'Error loading files. ';
        let showRetryButton = false;
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Cannot connect to server. Please ensure the server is running at <strong>http://localhost:3000</strong>';
            showRetryButton = true;
        } else {
            errorMessage += 'Please try again later.';
            showRetryButton = true;
        }
        
        const retryButton = showRetryButton ? '<button onclick="loadFiles()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button>' : '';
        gallery.innerHTML = `<div class="error">${errorMessage}${retryButton}</div>`;
        console.error('Error loading files:', error);
    }
}

function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `
        <div class="file-card-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="file-card-info">
            <h4>${escapeHtml(file.originalname)}</h4>
            <p>Uploaded by: ${escapeHtml(file.uploader_name || 'Unknown')}</p>
            <p class="file-meta">${formatFileSize(file.size)} • ${formatDate(file.created_at)}</p>
        </div>
        <div class="file-card-actions">
            <a href="${file.path}" target="_blank" class="btn btn-small btn-primary">View</a>
            <button class="btn btn-small btn-secondary view-comments" data-file-id="${file.id}">Comments</button>
            ${(currentUser && (currentUser.role === 'admin' || currentUser.id === file.uploaded_by)) 
                ? `<button class="btn btn-small btn-danger delete-file" data-file-id="${file.id}">Delete</button>` 
                : ''}
        </div>
    `;

    // Add event listeners
    card.querySelector('.view-comments')?.addEventListener('click', () => viewFileDetails(file.id));
    card.querySelector('.delete-file')?.addEventListener('click', () => deleteFile(file.id));

    return card;
}

async function viewFileDetails(fileId) {
    try {
        const [fileResponse, commentsResponse] = await Promise.all([
            fetch(`${API_BASE}/files/${fileId}`),
            fetch(`${API_BASE}/files/${fileId}/comments`)
        ]);

        const file = await fileResponse.json();
        const comments = await commentsResponse.json();

        const modalContent = document.getElementById('fileModalContent');
        modalContent.innerHTML = `
            <div class="file-details">
                <h2>${escapeHtml(file.originalname)}</h2>
                <div class="file-details-info">
                    <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                    <p><strong>Uploaded by:</strong> ${escapeHtml(file.uploader_name || 'Unknown')}</p>
                    <p><strong>Date:</strong> ${formatDate(file.created_at)}</p>
                </div>
                <div class="file-download">
                    <a href="${file.path}" target="_blank" class="btn btn-primary">Download File</a>
                </div>
                
                <div class="comments-section">
                    <h3>Comments (${comments.length})</h3>
                    ${currentUser 
                        ? `<form id="commentForm" class="comment-form">
                            <textarea id="commentContent" placeholder="Write a comment..." required></textarea>
                            <button type="submit" class="btn btn-primary">Post Comment</button>
                        </form>` 
                        : '<p>Please <a href="#" onclick="event.preventDefault(); openModal(\'loginModal\')">login</a> to comment.</p>'}
                    <div class="comments-list" id="commentsList">
                        ${comments.map(comment => `
                            <div class="comment-item">
                                <div class="comment-header">
                                    <strong>${escapeHtml(comment.username)}</strong>
                                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                                    ${(currentUser && (currentUser.role === 'admin' || currentUser.id === comment.user_id))
                                        ? `<button class="delete-comment btn-small" data-comment-id="${comment.id}">Delete</button>`
                                        : ''}
                                </div>
                                <div class="comment-content">${escapeHtml(comment.content)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add comment form handler
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await postComment(fileId);
            });
        }

        // Add delete comment handlers
        document.querySelectorAll('.delete-comment').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const commentId = e.target.dataset.commentId;
                await deleteComment(commentId, fileId);
            });
        });

        openModal('fileModal');
    } catch (error) {
        showNotification('Error loading file details', 'error');
    }
}

async function postComment(fileId) {
    const content = document.getElementById('commentContent').value;
    if (!content.trim()) return;

    try {
        const response = await fetch(`${API_BASE}/files/${fileId}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content })
        });

        const comment = await response.json();

        if (response.ok) {
            document.getElementById('commentContent').value = '';
            viewFileDetails(fileId); // Reload details
            showNotification('Comment posted!', 'success');
        } else {
            showNotification(comment.error || 'Failed to post comment', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

async function deleteComment(commentId, fileId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch(`${API_BASE}/comments/${commentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            viewFileDetails(fileId); // Reload details
            showNotification('Comment deleted', 'success');
        } else {
            const data = await response.json();
            showNotification(data.error || 'Failed to delete comment', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
        const response = await fetch(`${API_BASE}/files/${fileId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            loadFiles();
            if (currentUser?.role === 'admin') {
                loadAdminFiles();
            }
            showNotification('File deleted successfully', 'success');
        } else {
            showNotification(data.error || 'Failed to delete file', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

// ============================================
// Admin Panel
// ============================================

async function loadAdminData() {
    if (currentUser?.role !== 'admin') return;
    
    await Promise.all([
        loadAdminStats(),
        loadAdminUsers(),
        loadAdminFiles()
    ]);
}

async function loadAdminStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`, {
            headers: getAuthHeaders()
        });
        const stats = await response.json();
        
        document.getElementById('statUsers').textContent = stats.total_users || 0;
        document.getElementById('statFiles').textContent = stats.total_files || 0;
        document.getElementById('statComments').textContent = stats.total_comments || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadAdminUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            headers: getAuthHeaders()
        });
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${escapeHtml(user.username)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>
                    <select class="role-select" data-user-id="${user.id}" ${user.id === currentUser.id ? 'disabled' : ''}>
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    ${user.id !== currentUser.id 
                        ? `<button class="btn btn-small btn-danger delete-user" data-user-id="${user.id}">Delete</button>`
                        : '<span>Current user</span>'}
                </td>
            </tr>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.role-select').forEach(select => {
            select.addEventListener('change', (e) => {
                updateUserRole(e.target.dataset.userId, e.target.value);
            });
        });

        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteUser(e.target.dataset.userId);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadAdminFiles() {
    try {
        const response = await fetch(`${API_BASE}/files`);
        const files = await response.json();
        
        const tbody = document.getElementById('adminFilesTableBody');
        tbody.innerHTML = files.map(file => `
            <tr>
                <td>${file.id}</td>
                <td>${escapeHtml(file.originalname)}</td>
                <td>${escapeHtml(file.uploader_name || 'Unknown')}</td>
                <td>${formatFileSize(file.size)}</td>
                <td>${formatDate(file.created_at)}</td>
                <td>
                    <button class="btn btn-small btn-danger delete-file-admin" data-file-id="${file.id}">Delete</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.delete-file-admin').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteFile(e.target.dataset.fileId);
            });
        });
    } catch (error) {
        console.error('Error loading admin files:', error);
    }
}

async function updateUserRole(userId, role) {
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ role })
        });

        if (response.ok) {
            showNotification('User role updated', 'success');
            loadAdminUsers();
        } else {
            const data = await response.json();
            showNotification(data.error || 'Failed to update role', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            showNotification('User deleted', 'success');
            loadAdminUsers();
            loadAdminStats();
        } else {
            const data = await response.json();
            showNotification(data.error || 'Failed to delete user', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

// Admin tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        document.querySelectorAll('.admin-content').forEach(content => {
            content.style.display = 'none';
        });
        
        if (tab === 'users') {
            document.getElementById('usersTab').style.display = 'block';
        } else if (tab === 'files') {
            document.getElementById('filesTab').style.display = 'block';
            loadAdminFiles();
        }
    });
});

// ============================================
// Contact Form Handling
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// ============================================
// Utility Functions
// ============================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a toast library
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ============================================
// Initialize on Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    loadFiles();
    
    if (currentUser?.role === 'admin') {
        loadAdminData();
    }

    // Initialize file upload functionality
    initializeFileUpload();

    // Animate elements
    const animateElements = document.querySelectorAll('.about-card, .service-card, .portfolio-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
