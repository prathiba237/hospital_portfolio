// Hospital Project Shared JS Logic

// ================= AUTHENTICATION =================
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

// ================= GEMINI CHATBOT LOGIC =================
document.addEventListener('DOMContentLoaded', () => {
    // Get all chatbot UI elements
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Exit if this page doesn't have the chatbot HTML
    if (!chatbotBtn || !chatbotWindow) return;

    let isChatOpen = false;

    // Toggle chat window visibility
    chatbotBtn.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatbotWindow.classList.toggle('hidden', !isChatOpen);
        if (isChatOpen) {
            chatInput.focus();
            // Hide the unread badge when opened
            const badge = document.getElementById('unreadBadge');
            if(badge) badge.style.display = 'none';
        }
    });

    // Close chat window via the 'X' button
    chatbotClose.addEventListener('click', () => {
        isChatOpen = false;
        chatbotWindow.classList.add('hidden');
    });

    // Send message when pressing "Enter"
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Send message on button click
    chatSend.addEventListener('click', sendChatMessage);

    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Show user's message in the chat UI
        addMessageToChat(message, 'user');
        chatInput.value = '';
        chatInput.focus();

        // 2. Show a temporary "Typing..." indicator
        const typingId = 'typing-' + Date.now();
        addMessageToChat('Typing...', 'bot', typingId);

        try {
            // 3. Send the message to your backend /api/chat route
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            
            // 4. Remove "Typing..." and show Gemini's real reply
            removeMessage(typingId);
            addMessageToChat(data.reply, 'bot');

        } catch (error) {
            console.error('Chat error:', error);
            removeMessage(typingId);
            addMessageToChat('Sorry, I encountered an error. Please try again later.', 'bot');
        }
    }

    // Helper function to append messages to the chat window
    function addMessageToChat(text, sender, id = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`; // 'user-message' or 'bot-message'
        if (id) messageDiv.id = id;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        // Add a nice timestamp (e.g., "10:30 AM")
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        chatMessages.appendChild(messageDiv);
        
        // Auto-scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper function to remove specific messages (like the typing indicator)
    function removeMessage(id) {
        const msgElement = document.getElementById(id);
        if (msgElement) msgElement.remove();
    }
});