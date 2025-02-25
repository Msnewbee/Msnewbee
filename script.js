const scriptUrl = 'https://script.google.com/macros/s/AKfycbwGEtWwQ4j-lgh5_V9lyfReTQE5SLCYW9IiVo6cDyAIcSM4q0azFnwh9O2SLfC351kGpw/exec';

let isProcessing = false;

async function handleReaction(videoId, action) {
    if (isProcessing) return;
    isProcessing = true;

    const likeBtn = document.getElementById(`likeBtn_${videoId}`);
    const dislikeBtn = document.getElementById(`dislikeBtn_${videoId}`);
    const likeCount = document.getElementById(`likeCount_${videoId}`);
    const dislikeCount = document.getElementById(`dislikeCount_${videoId}`);

    likeBtn.disabled = true;
    dislikeBtn.disabled = true;

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({ videoId: videoId, action: action }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        likeCount.innerText = data.likes;
        dislikeCount.innerText = data.dislikes;
    } catch (error) {
        console.error('Error:', error);
        const currentLikes = parseInt(localStorage.getItem(`likes_${videoId}`)) || 0;
        const currentDislikes = parseInt(localStorage.getItem(`dislikes_${videoId}`)) || 0;

        if (action === 'like') {
            localStorage.setItem(`likes_${videoId}`, currentLikes + 1);
            likeCount.innerText = currentLikes + 1;
        } else if (action === 'dislike') {
            localStorage.setItem(`dislikes_${videoId}`, currentDislikes + 1);
            dislikeCount.innerText = currentDislikes + 1;
        }
    } finally {
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        isProcessing = false;
    }
}

function loadReactions(videoId) {
    const likeCount = document.getElementById(`likeCount_${videoId}`);
    const dislikeCount = document.getElementById(`dislikeCount_${videoId}`);

    fetch(`${scriptUrl}?videoId=${videoId}`)
        .then(response => response.json())
        .then(data => {
            likeCount.innerText = data.likes;
            dislikeCount.innerText = data.dislikes;
        })
        .catch(error => {
            console.error('Error:', error);
            likeCount.innerText = parseInt(localStorage.getItem(`likes_${videoId}`)) || 0;
            dislikeCount.innerText = parseInt(localStorage.getItem(`dislikes_${videoId}`)) || 0;
        });
}

function searchVideos() {
    let searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchTerm) {
        alert("Silakan masukkan kata kunci pencarian.");
        showAllVideos();
        return;
    }

    let videos = document.querySelectorAll('#vidio .content-box');
    let found = false;

    videos.forEach(video => {
        let videoTitle = video.querySelector('h3');
        let titleText = videoTitle.innerText.toLowerCase();
        if (titleText.includes(searchTerm)) {
            video.style.display = 'block';
            videoTitle.innerHTML = titleText.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span class="highlight">${match}</span>` // Highlight kata kunci
            );
            found = true;
        } else {
            video.style.display = 'none';
            videoTitle.innerHTML = titleText; // Reset highlight
        }
    });

    if (!found) {
        alert("Tidak ada video yang cocok dengan kata kunci '" + searchTerm + "'.");
        showAllVideos();
    }
}

function showAllVideos() {
    let videos = document.querySelectorAll('#vidio .content-box');
    videos.forEach(video => {
        video.style.display = 'block'; // Tampilkan semua video
    });
}

function showTab(tabId) {
    let sections = document.querySelectorAll('.content-box');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

window.onload = function() {
    showTab('loby');
    loadReactions('video1');
    loadReactions('video2');
    loadReactions('video3');
};
