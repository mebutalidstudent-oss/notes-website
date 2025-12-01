// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://lbdahpaqfxjncbxzqlrz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZGFocGFxZnhqbmNieHpxbHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTUwNzUsImV4cCI6MjA4MDE3MTA3NX0.wwKYaYCOqPtiKH7GBG2rvZ6UpmMlBWCUE-Eg9hy5AF4';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase initialized');

// ============================================
// ANIMATION FUNCTIONS
// ============================================

// Hide startup screen
function hideStartupScreen() {
    const startupScreen = document.getElementById('startup-screen');
    if (startupScreen) {
        setTimeout(() => {
            startupScreen.style.display = 'none';
        }, 3000); // Wait for animation to complete
    }
}

// Animate auth to dashboard transition
function animateToDashboard() {
    const authSection = document.getElementById('auth-section');
    const notesSection = document.getElementById('notes-section');
    
    if (authSection && notesSection) {
        // Add exit animation to auth section
        authSection.classList.add('auth-transition');
        
        // Wait for exit animation, then show dashboard
        setTimeout(() => {
            authSection.classList.add('hidden');
            authSection.classList.remove('auth-transition');
            
            notesSection.classList.remove('hidden');
            notesSection.classList.add('dashboard-transition');
            
            // Remove transition class after animation completes
            setTimeout(() => {
                notesSection.classList.remove('dashboard-transition');
            }, 600);
        }, 600);
    }
}

// Animate dashboard to auth transition
function animateToAuth() {
    const authSection = document.getElementById('auth-section');
    const notesSection = document.getElementById('notes-section');
    
    if (authSection && notesSection) {
        // Add exit animation to dashboard
        notesSection.classList.add('auth-transition');
        
        // Wait for exit animation, then show auth
        setTimeout(() => {
            notesSection.classList.add('hidden');
            notesSection.classList.remove('auth-transition');
            
            authSection.classList.remove('hidden');
            authSection.classList.add('dashboard-transition');
            
            // Remove transition class after animation completes
            setTimeout(() => {
                authSection.classList.remove('dashboard-transition');
            }, 600);
        }, 600);
    }
}

// Animate note creation
function animateNoteCreation(noteElement) {
    if (noteElement) {
        noteElement.style.animation = 'none';
        void noteElement.offsetWidth; // Trigger reflow
        noteElement.style.animation = 'scaleIn 0.5s ease';
    }
}

// Animate note deletion
function animateNoteDeletion(noteElement, callback) {
    if (noteElement) {
        noteElement.style.animation = 'scaleOut 0.3s ease';
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }
}

// Loading animation for buttons
function animateButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        const originalHTML = button.innerHTML;
        button.dataset.originalHTML = originalHTML;
        button.innerHTML = `
            <span class="loading-spinner"></span>
            <span style="margin-left: 8px;">Loading...</span>
        `;
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        if (button.dataset.originalHTML) {
            button.innerHTML = button.dataset.originalHTML;
        }
    }
}

// Success animation
function showSuccessAnimation(element) {
    if (element) {
        const originalHTML = element.innerHTML;
        element.innerHTML = `
            <span class="success-check"></span>
            <span style="margin-left: 8px;">Success!</span>
        `;
        
        setTimeout(() => {
            element.innerHTML = originalHTML;
        }, 1500);
    }
}

// ============================================
// PROFESSIONAL HELPER FUNCTIONS
// ============================================

// Professional toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('status-toast');
    const icon = toast.querySelector('i');
    const messageEl = document.getElementById('status-message');
    
    // Set icon based on type
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    messageEl.textContent = message;
    toast.className = `status-toast ${type}`;
    toast.classList.remove('hidden');
    
    // Add entrance animation
    toast.style.animation = 'slideInRight 0.3s ease';
    
    // Auto-hide after 4 seconds with exit animation
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.style.animation = '';
        }, 300);
    }, 4000);
}

// Update stats in sidebar
async function updateStats() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id);
        
        if (error) throw error;
        
        const totalNotes = notes?.length || 0;
        const notesWithMedia = notes?.filter(note => note.media_url).length || 0;
        
        // Animate the count changes
        animateCountChange('notes-count', totalNotes);
        animateCountChange('media-count', notesWithMedia);
        animateCountChange('notes-total', totalNotes);
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Animate number counting
function animateCountChange(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue === targetValue) return;
    
    const duration = 500; // ms
    const increment = (targetValue - currentValue) / (duration / 16); // 60fps
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Professional date formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }
    // Today
    if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // This week
    if (diff < 604800000) {
        return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    // Older
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

// File preview setup
function setupFilePreview() {
    const mediaUpload = document.getElementById('media-upload');
    const preview = document.getElementById('file-preview');
    
    if (!mediaUpload || !preview) return;
    
    mediaUpload.addEventListener('change', function(e) {
        preview.innerHTML = '';
        
        if (this.files.length > 0) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const fileSize = (file.size / (1024*1024)).toFixed(2);
                
                if (file.type.startsWith('image/')) {
                    preview.innerHTML = `
                        <div class="preview-item" style="animation: slideUp 0.4s ease;">
                            <img src="${e.target.result}" alt="Preview" class="preview-image">
                            <div class="preview-info">
                                <div class="preview-name">${file.name}</div>
                                <div class="preview-size">${fileSize} MB</div>
                            </div>
                        </div>
                    `;
                } else if (file.type.startsWith('video/')) {
                    preview.innerHTML = `
                        <div class="preview-item" style="animation: slideUp 0.4s ease;">
                            <video class="preview-video">
                                <source src="${e.target.result}" type="${file.type}">
                            </video>
                            <div class="preview-info">
                                <div class="preview-name">${file.name}</div>
                                <div class="preview-size">${fileSize} MB</div>
                            </div>
                        </div>
                    `;
                }
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Update user info in header
function updateUserInfo(user) {
    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('user-avatar');
    
    if (emailEl && user) {
        emailEl.textContent = user.email;
        emailEl.style.animation = 'fadeIn 0.5s ease';
    }
    
    if (avatarEl && user) {
        const initials = user.email.substring(0, 2).toUpperCase();
        avatarEl.innerHTML = `<span>${initials}</span>`;
        // Add gradient background with animation
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];
        const gradientIndex = user.email.length % gradients.length;
        avatarEl.style.background = gradients[gradientIndex];
        avatarEl.style.animation = 'scaleIn 0.5s ease';
    }
}

// ============================================
// DOM ELEMENTS
// ============================================
const authSection = document.getElementById('auth-section');
const notesSection = document.getElementById('notes-section');
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const logoutBtn = document.getElementById('logout-btn');
const createNoteBtn = document.getElementById('create-note-btn');
const noteContent = document.getElementById('note-content');
const mediaUpload = document.getElementById('media-upload');
const notesContainer = document.getElementById('notes-container');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Hide startup screen after delay
    setTimeout(hideStartupScreen, 3000);
    
    // Form switching with animation
    document.getElementById('show-signin')?.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.animation = 'slideOutLeft 0.4s ease';
        setTimeout(() => {
            signupForm.classList.add('hidden');
            signupForm.style.animation = '';
            signinForm.classList.remove('hidden');
            signinForm.style.animation = 'slideInRight 0.4s ease';
            setTimeout(() => {
                signinForm.style.animation = '';
            }, 400);
        }, 400);
    });
    
    document.getElementById('show-signup')?.addEventListener('click', function(e) {
        e.preventDefault();
        signinForm.style.animation = 'slideOutLeft 0.4s ease';
        setTimeout(() => {
            signinForm.classList.add('hidden');
            signinForm.style.animation = '';
            signupForm.classList.remove('hidden');
            signupForm.style.animation = 'slideInRight 0.4s ease';
            setTimeout(() => {
                signupForm.style.animation = '';
            }, 400);
        }, 400);
    });
    
    // Auth buttons
    if (signupBtn) signupBtn.addEventListener('click', handleSignUp);
    if (signinBtn) signinBtn.addEventListener('click', handleSignIn);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (createNoteBtn) createNoteBtn.addEventListener('click', createNote);
    
    // Setup features
    setupFilePreview();
    
    // Initial setup
    setTimeout(() => {
        checkAuth();
    }, 500); // Small delay after startup animation
});

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================
async function handleSignUp() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        // Add shake animation to inputs
        document.getElementById('signup-email').style.animation = 'pulse 0.3s ease';
        document.getElementById('signup-password').style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            document.getElementById('signup-email').style.animation = '';
            document.getElementById('signup-password').style.animation = '';
        }, 300);
        return;
    }

    animateButtonLoading(signupBtn, true);

    try {
        console.log('Signing up:', email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        console.log('Sign up successful:', data);
        showSuccessAnimation(signupBtn);
        showToast('✅ Account created successfully!', 'success');
        
        // Switch to sign in form with animation
        setTimeout(() => {
            signupForm.style.animation = 'slideOutLeft 0.4s ease';
            setTimeout(() => {
                signupForm.classList.add('hidden');
                signupForm.style.animation = '';
                signinForm.classList.remove('hidden');
                signinForm.style.animation = 'slideInRight 0.4s ease';
                document.getElementById('signin-email').value = email;
                setTimeout(() => {
                    signinForm.style.animation = '';
                }, 400);
            }, 400);
        }, 500);
        
    } catch (error) {
        console.error('Sign up failed:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        animateButtonLoading(signupBtn, false);
    }
}

async function handleSignIn() {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        // Add shake animation to inputs
        document.getElementById('signin-email').style.animation = 'pulse 0.3s ease';
        document.getElementById('signin-password').style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            document.getElementById('signin-email').style.animation = '';
            document.getElementById('signin-password').style.animation = '';
        }, 300);
        return;
    }

    animateButtonLoading(signinBtn, true);

    try {
        console.log('Signing in:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        console.log('Sign in successful:', data);
        showSuccessAnimation(signinBtn);
        showToast('✅ Welcome back!', 'success');
        updateUserInfo(data.user);
        
        // Animate transition to dashboard
        setTimeout(() => {
            animateToDashboard();
            setTimeout(() => {
                loadNotes();
                updateStats();
            }, 600);
        }, 500);
        
    } catch (error) {
        console.error('Sign in failed:', error);
        showToast('Error signing in: ' + error.message, 'error');
    } finally {
        animateButtonLoading(signinBtn, false);
    }
}

async function handleLogout() {
    animateButtonLoading(logoutBtn, true);
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        console.log('Logged out');
        showSuccessAnimation(logoutBtn);
        showToast('✅ Successfully logged out', 'success');
        
        // Animate transition back to auth
        setTimeout(() => {
            animateToAuth();
        }, 500);
        
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out: ' + error.message, 'error');
    } finally {
        animateButtonLoading(logoutBtn, false);
    }
}

async function checkAuth() {
    try {
        console.log('Checking auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Auth error:', error);
            return;
        }
        
        if (session) {
            console.log('User logged in:', session.user.email);
            updateUserInfo(session.user);
            
            // Directly show dashboard without animation on page load
            showNotesSection();
            loadNotes();
            updateStats();
        } else {
            console.log('No session found');
            showAuthSection();
        }
    } catch (error) {
        console.error('Check auth error:', error);
        showAuthSection();
    }
}

// ============================================
// UI FUNCTIONS
// ============================================
function showAuthSection() {
    console.log('Showing auth section');
    if (authSection) authSection.classList.remove('hidden');
    if (notesSection) notesSection.classList.add('hidden');
    // Clear forms
    if (document.getElementById('signup-email')) document.getElementById('signup-email').value = '';
    if (document.getElementById('signup-password')) document.getElementById('signup-password').value = '';
    if (document.getElementById('signin-email')) document.getElementById('signin-email').value = '';
    if (document.getElementById('signin-password')) document.getElementById('signin-password').value = '';
}

function showNotesSection() {
    console.log('Showing notes section');
    if (authSection) authSection.classList.add('hidden');
    if (notesSection) notesSection.classList.remove('hidden');
    // Clear note form
    if (noteContent) noteContent.value = '';
    if (mediaUpload) {
        mediaUpload.value = '';
        const preview = document.getElementById('file-preview');
        if (preview) preview.innerHTML = '';
    }
}

// ============================================
// NOTES FUNCTIONS
// ============================================
async function createNote() {
    const content = noteContent.value.trim();
    
    if (!content) {
        showToast('Please enter note content', 'error');
        // Add shake animation to textarea
        noteContent.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            noteContent.style.animation = '';
        }, 300);
        return;
    }

    animateButtonLoading(createNoteBtn, true);

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
            showToast('Please sign in first', 'error');
            return;
        }

        console.log('Creating note for:', user.email);

        let mediaUrl = null;

        // Handle file upload
        if (mediaUpload.files.length > 0) {
            const file = mediaUpload.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            console.log('Uploading file:', fileName);
            
            const { error: uploadError } = await supabase.storage
                .from('notes-media')
                .upload(filePath, file);

            if (uploadError) {
                showToast('File upload failed: ' + uploadError.message, 'error');
                throw uploadError;
            }

            // Get URL
            const { data: urlData } = supabase.storage
                .from('notes-media')
                .getPublicUrl(filePath);

            mediaUrl = urlData.publicUrl;
            console.log('File uploaded:', mediaUrl);
        }

        // Save to database
        console.log('Saving note to database...');
        const { data, error } = await supabase
            .from('notes')
            .insert([{
                user_id: user.id,
                content: content,
                media_url: mediaUrl,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;

        console.log('Note saved:', data);
        showSuccessAnimation(createNoteBtn);
        showToast('✅ Note created successfully!', 'success');
        
        // Clear form with animation
        noteContent.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            noteContent.value = '';
            noteContent.style.animation = 'fadeIn 0.3s ease';
            setTimeout(() => {
                noteContent.style.animation = '';
            }, 300);
        }, 300);
        
        mediaUpload.value = '';
        const preview = document.getElementById('file-preview');
        if (preview) {
            preview.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                preview.innerHTML = '';
                preview.style.animation = 'fadeIn 0.3s ease';
                setTimeout(() => {
                    preview.style.animation = '';
                }, 300);
            }, 300);
        }
        
        // Reload notes and update stats
        setTimeout(() => {
            loadNotes();
            updateStats();
        }, 300);
        
    } catch (error) {
        console.error('Error creating note:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        animateButtonLoading(createNoteBtn, false);
    }
}

async function loadNotes() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!user) {
            if (notesContainer) {
                notesContainer.innerHTML = `
                    <div class="empty-state" style="animation: fadeIn 0.5s ease;">
                        <i class="fas fa-sign-in-alt"></i>
                        <h3>Please sign in</h3>
                        <p>Sign in to view your notes</p>
                    </div>
                `;
            }
            return;
        }

        console.log('Loading notes for:', user.id);
        
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log(`Loaded ${notes?.length || 0} notes`);
        displayNotes(notes || []);
        
    } catch (error) {
        console.error('Error loading notes:', error);
        if (notesContainer) {
            notesContainer.innerHTML = `
                <div class="empty-state error" style="animation: fadeIn 0.5s ease;">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error loading notes</h3>
                    <p>Please try again later</p>
                </div>
            `;
        }
        showToast('Error loading notes', 'error');
    }
}

function displayNotes(notes) {
    if (!notesContainer) return;
    
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state" style="animation: fadeIn 0.5s ease;">
                <i class="fas fa-sticky-note"></i>
                <h3>No notes yet</h3>
                <p>Create your first note to get started</p>
            </div>
        `;
        return;
    }

    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.dataset.id = note.id;
        noteElement.style.animationDelay = `${index * 0.1}s`;
        
        const formattedDate = formatDate(note.created_at);
        
        // Create media HTML if exists
        let mediaHTML = '';
        if (note.media_url) {
            const isVideo = note.media_url.match(/\.(mp4|webm|ogg|mov)$/i);
            
            if (isVideo) {
                mediaHTML = `
                    <div class="note-media" style="animation: fadeIn 0.5s ease ${index * 0.1 + 0.2}s;">
                        <video controls>
                            <source src="${note.media_url}" type="video/mp4">
                        </video>
                    </div>
                `;
            } else {
                mediaHTML = `
                    <div class="note-media" style="animation: fadeIn 0.5s ease ${index * 0.1 + 0.2}s;">
                        <img src="${note.media_url}" alt="Note attachment" loading="lazy">
                    </div>
                `;
            }
        }
        
        // Generate tag color based on content
        const tagColors = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'];
        const tagIndex = note.content.length % tagColors.length;
        const tagColor = tagColors[tagIndex];
        const tagNames = ['Work', 'Personal', 'Ideas', 'Important', 'Archive'];
        
        noteElement.innerHTML = `
            <div class="note-header" style="animation: fadeIn 0.4s ease ${index * 0.1}s;">
                <div class="note-tag" style="background: ${tagColor}20; color: ${tagColor};">
                    <i class="fas fa-tag" style="color: ${tagColor};"></i>
                    <span>${tagNames[tagIndex]}</span>
                </div>
                <div class="note-date">${formattedDate}</div>
            </div>
            
            <div class="note-content" style="animation: fadeIn 0.4s ease ${index * 0.1 + 0.1}s;">${note.content.replace(/\n/g, '<br>')}</div>
            
            ${mediaHTML}
            
            <div class="note-footer" style="animation: fadeIn 0.4s ease ${index * 0.1 + 0.3}s;">
                <button class="btn btn-warning btn-sm" onclick="editNote('${note.id}', '${note.content.replace(/'/g, "\\'")}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteNote('${note.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        notesContainer.appendChild(noteElement);
    });
}

// Edit note function (global for onclick)
window.editNote = async function(noteId, currentContent) {
    const newContent = prompt('Edit your note:', currentContent.replace(/\\'/g, "'"));
    
    if (newContent !== null && newContent !== currentContent) {
        const button = document.activeElement;
        animateButtonLoading(button, true);
        
        try {
            const { error } = await supabase
                .from('notes')
                .update({ content: newContent })
                .eq('id', noteId);

            if (error) throw error;
            
            console.log('Note updated');
            showSuccessAnimation(button);
            showToast('✅ Note updated successfully!', 'success');
            loadNotes();
        } catch (error) {
            console.error('Update error:', error);
            showToast('Error updating note: ' + error.message, 'error');
        } finally {
            animateButtonLoading(button, false);
        }
    }
}

// Delete note function (global for onclick)
window.deleteNote = async function(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    const button = document.activeElement;
    const noteElement = document.querySelector(`[data-id="${noteId}"]`);
    
    if (noteElement) {
        animateNoteDeletion(noteElement, async () => {
            animateButtonLoading(button, true);
            
            try {
                const { error } = await supabase
                    .from('notes')
                    .delete()
                    .eq('id', noteId);

                if (error) throw error;
                
                console.log('Note deleted');
                showSuccessAnimation(button);
                showToast('✅ Note deleted successfully!', 'success');
                loadNotes();
                updateStats();
            } catch (error) {
                console.error('Delete error:', error);
                showToast('Error deleting note: ' + error.message, 'error');
            } finally {
                animateButtonLoading(button, false);
            }
        });
    }
}

// ============================================
// AUTH STATE LISTENER
// ============================================
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state:', event);
    
    if (event === 'SIGNED_IN') {
        if (session.user) {
            updateUserInfo(session.user);
        }
        // Don't animate on auth state change, only on manual sign in
    } else if (event === 'SIGNED_OUT') {
        // Don't animate on auth state change, only on manual logout
    }
});

// ============================================
// INITIALIZATION
// ============================================
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Startup animation already handled by CSS
    // Check auth after a small delay
    setTimeout(() => {
        checkAuth();
    }, 500);
});

// Make functions globally available
window.handleSignUp = handleSignUp;
window.handleSignIn = handleSignIn;
window.handleLogout = handleLogout;
window.createNote = createNote;
window.editNote = window.editNote;
window.deleteNote = window.deleteNote;