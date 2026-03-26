// Hospital Project Shared JS Logic

// Check auth on every page load
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    const loginLink = document.getElementById('nav-login');
    const logoutLink = document.getElementById('nav-logout');
    const myAppsLink = document.getElementById('nav-my-apps');

    if (token) {
        if(loginLink) loginLink.classList.add('hide');
        if(logoutLink) logoutLink.classList.remove('hide');
        if(myAppsLink) myAppsLink.classList.remove('hide');
    } else {
        if(loginLink) loginLink.classList.remove('hide');
        if(logoutLink) logoutLink.classList.add('hide');
        if(myAppsLink) myAppsLink.classList.add('hide');
    }
}

// Global logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert("You have been logged out.");
    window.location.href = 'index.html';
}

// Call check status if not on a specific page
if(!window.onload) {
    checkAuthStatus();
}

// ================= REGISTER FUNCTION =================
async function registerUser(e) {
    e.preventDefault();

    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    console.log("Sending:", { username, email, password }); // DEBUG

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,  // ✅ MUST match backend
                email,
                password
            })
        });

        const data = await res.json();
        console.log("Response:", data);

        alert(data.message);

        if (data.success) {
            window.location.href = 'login.html'; // redirect after success
        }

    } catch (error) {
        console.error("Register Error:", error);
        alert("Registration failed");
    }
}