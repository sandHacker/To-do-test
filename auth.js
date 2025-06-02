// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile'); // Added mobile logout button
    const authContainer = document.getElementById('auth-container'); // On index.html
    const appContainer = document.getElementById('app-container');   // On index.html

    // --- IMPORTANT SECURITY WARNING ---
    // The current implementation uses localStorage for storing user credentials (username)
    // and session management. This is INSECURE for a real application.
    // Passwords are not directly stored, but this method is vulnerable to XSS attacks.
    // For a production environment, a proper backend with secure database storage,
    // password hashing (e.g., bcrypt), and server-side sessions is crucial.
    console.warn('SECURITY WARNING: User authentication is handled via localStorage and is insecure. This is for demonstration purposes only.');

    const loggedInUser = localStorage.getItem('loggedInUser');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is empty

    // Page Protection Logic
    if (currentPage === 'index.html') {
        if (!loggedInUser) {
            if (authContainer) authContainer.style.display = 'block';
            if (appContainer) appContainer.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (logoutBtnMobile) logoutBtnMobile.style.display = 'none'; // Ensure mobile logout is hidden
        } else {
            // User is logged in, show app, hide auth links
            if (authContainer) authContainer.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (logoutBtnMobile) logoutBtnMobile.style.display = 'block'; // Show mobile logout button (use 'block' for <a> in <li>)
        }
    } else if (currentPage === 'login.html' || currentPage === 'signup.html') {
        if (loggedInUser) {
            // If user is already logged in and tries to access login/signup, redirect to main app
            window.location.href = 'index.html';
            return; // Stop further script execution on these pages if redirecting
        }
    }

    // --- Sign-up Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('new-username');
            const passwordInput = document.getElementById('new-password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!username || !password || !confirmPassword) {
                alert('All fields are required.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.find(user => user.username === username)) {
                    alert('Username already exists. Please choose another one.');
                    return;
                }
                const hashedPassword = "hashed_" + password;
                users.push({ username, password: hashedPassword });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Sign up successful! Please login.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error during sign-up:', error);
                alert('An error occurred during sign-up. Please try again.');
            }
        });
    }

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                alert('Both username and password are required.');
                return;
            }

            try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.username === username);

                if (user && ("hashed_" + password === user.password)) {
                    localStorage.setItem('loggedInUser', username);
                    // alert('Login successful!'); // Alert can be removed for smoother redirection
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid username or password.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    }

    // --- Logout Logic (for index.html) ---
    function handleLogout() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleLogout();
            // No need to explicitly close dropdownMenu here as page navigates away
        });
    }

    // Dark Mode Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setInitialTheme() {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                darkModeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                darkModeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }
    setInitialTheme(); // Apply theme on load
});
