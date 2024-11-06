import { backend } from "declarations/backend";

let quill;
const newPostBtn = document.getElementById('newPostBtn');
const newPostForm = document.getElementById('newPostForm');
const postForm = document.getElementById('postForm');
const cancelBtn = document.getElementById('cancelBtn');
const loading = document.getElementById('loading');
const postsContainer = document.getElementById('posts');

// Initialize Quill editor
document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
    
    loadPosts();
});

// Event Listeners
newPostBtn.addEventListener('click', () => {
    newPostForm.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    newPostForm.classList.add('hidden');
    resetForm();
});

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    showLoading();
    
    try {
        await backend.createPost(title, body, author);
        newPostForm.classList.add('hidden');
        resetForm();
        await loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    } finally {
        hideLoading();
    }
});

// Helper Functions
async function loadPosts() {
    showLoading();
    try {
        const posts = await backend.getPosts();
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
        alert('Failed to load posts. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

function displayPosts(posts) {
    postsContainer.innerHTML = posts.map(post => `
        <article class="post">
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span class="author">By ${post.author}</span>
                <span class="date">${new Date(Number(post.timestamp) / 1000000).toLocaleDateString()}</span>
            </div>
            <div class="post-content">
                ${post.body}
            </div>
        </article>
    `).join('');
}

function resetForm() {
    postForm.reset();
    quill.setContents([]);
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}
