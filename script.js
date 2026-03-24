// Utilities
const showLoader = (containerId) => {
    document.getElementById(containerId).innerHTML = '<div class="spinner"></div>';
};

const showError = (containerId, message) => {
    document.getElementById(containerId).innerHTML = `<div class="error-text"><span>⚠️</span> ${message}</div>`;
};

const showToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    // Clear previous timeouts if triggering multiple times quickly
    if (window.toastTimeout) clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// ==========================================
// 1. Dog API (https://dog.ceo/api)
// ==========================================
let currentDogUrl = '';

const extractDogBreed = (url) => {
    // URL format: https://images.dog.ceo/breeds/hound-afghan/n02085465_108.jpg
    const match = url.match(/breeds\/([^/]+)/);
    if (match && match[1]) {
        // Reverse parts if separated by dash (e.g., hound-afghan -> afghan hound)
        return match[1].split('-').reverse().join(' ');
    }
    return 'Unknown Breed';
};

const fetchDog = async () => {
    showLoader('dog-content');
    const copyBtn = document.getElementById('btn-dog-copy');
    copyBtn.classList.add('hidden');

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        currentDogUrl = data.message;
        const breed = extractDogBreed(currentDogUrl);

        document.getElementById('dog-content').innerHTML = `
            <img src="${currentDogUrl}" alt="Random Dog" class="dog-image" />
            <p class="dog-breed">${breed}</p>
        `;
        copyBtn.classList.remove('hidden');
    } catch (error) {
        showError('dog-content', 'Failed to fetch cute doggo.');
        console.error(error);
    }
};

document.getElementById('btn-dog').addEventListener('click', fetchDog);

document.getElementById('btn-dog-copy').addEventListener('click', async () => {
    if (currentDogUrl) {
        try {
            await navigator.clipboard.writeText(currentDogUrl);
            showToast('✅ Image URL copied to clipboard!');
        } catch (err) {
            console.error('Copy failed', err);
            showToast('❌ Failed to copy text.');
        }
    }
});

// ==========================================
// 2. Joke Generator (https://v2.jokeapi.dev)
// ==========================================
const fetchJoke = async () => {
    showLoader('joke-content');
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=twopart');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        if (data.error) throw new Error('Joke API error');

        document.getElementById('joke-content').innerHTML = `
            <div class="joke-container">
                <p class="joke-setup">"${data.setup}"</p>
                <p class="joke-punchline">${data.delivery} 🥁</p>
            </div>
        `;
        document.getElementById('btn-joke').textContent = 'Next Joke';
    } catch (error) {
        showError('joke-content', 'Jokes API might be down. No laughing today.');
        console.error(error);
    }
};

document.getElementById('btn-joke').addEventListener('click', fetchJoke);

// ==========================================
// 3. Random User (https://randomuser.me/api/)
// ==========================================
const fetchUser = async () => {
    showLoader('user-content');
    try {
        const response = await fetch('https://randomuser.me/api/');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const user = data.results[0];

        document.getElementById('user-content').innerHTML = `
            <div class="user-profile">
                <img src="${user.picture.large}" alt="User Avatar" class="user-avatar" />
                <p class="user-name">${user.name.first} ${user.name.last}</p>
                <p class="user-detail"><span>📧</span> ${user.email}</p>
                <p class="user-detail"><span>🌍</span> ${user.location.country}</p>
                <p class="user-detail"><span>📞</span> ${user.phone}</p>
            </div>
        `;
    } catch (error) {
        showError('user-content', 'Could not load the random user.');
        console.error(error);
    }
};

document.getElementById('btn-user').addEventListener('click', fetchUser);

// ==========================================
// 4. JSONPlaceholder Posts (https://jsonplaceholder.typicode.com)
// ==========================================
const fetchPosts = async () => {
    showLoader('posts-content');
    try {
        // Appending timestamp to strictly bypass caching if needed, though usually not needed here
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        const postsHtml = data.map(post => `
            <li class="post-item" title="${post.title}">
                ${post.title}
            </li>
        `).join('');

        document.getElementById('posts-content').innerHTML = `
            <ul class="posts-list">
                ${postsHtml}
            </ul>
        `;
    } catch (error) {
        showError('posts-content', 'Could not fetch posts data.');
        console.error(error);
    }
};

document.getElementById('btn-posts').addEventListener('click', fetchPosts);

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Fetch initial data for all cards when the page loads
    fetchDog();
    fetchJoke();
    fetchUser();
    fetchPosts();
});
