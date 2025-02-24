document.addEventListener("DOMContentLoaded", function () {
    const ageVerification = document.getElementById("age-verification");
    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");

    // Cek apakah user sudah verifikasi usia
    if (localStorage.getItem("ageVerified") === "true") {
        ageVerification.style.display = "none";
    } else {
        ageVerification.style.display = "flex";
    }

    // Jika user memilih 18+
    btnYes.addEventListener("click", function () {
        localStorage.setItem("ageVerified", "true");
        ageVerification.style.display = "none";
    });

    // Jika user memilih di bawah 18 tahun
    btnNo.addEventListener("click", function () {
        alert("Anda tidak diizinkan mengakses situs ini.");
        window.location.href = "https://www.google.com"; // Redirect ke Google
    });

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwGEtWwQ4j-lgh5_V9lyfReTQE5SLCYW9IiVo6cDyAIcSM4q0azFnwh9O2SLfC351kGpw/exec';

    let isProcessing = false;

    async function handleReaction(videoId, action) {
        if (isProcessing) return;
        isProcessing = true;

        const likeBtn = document.getElementById(`likeBtn_${videoId}`);
        const dislikeBtn = document.getElementById(`dislikeBtn_${videoId}`);
        const likeCount = document.getElementById(`likeCount_${videoId}`);
        const dislikeCount = document.getElementById(`dislikeCount_${videoId}`);

        // Nonaktifkan tombol sementara
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;

        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ videoId: videoId, action: action })
            });
            const data = await response.json();

            // Update tampilan
            likeCount.innerText = data.likes;
            dislikeCount.innerText = data.dislikes;
        } catch (error) {
            console.error('Error:', error);
            // Fallback ke localStorage jika server error
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
            return;
        }

        let videos = document.querySelectorAll('#vidio .content-box h3');
        let found = false;

        videos.forEach(video => {
            let videoTitle = video.innerText.toLowerCase();
            let videoContainer = video.closest('.content-box');

            if (videoTitle.includes(searchTerm)) {
                videoContainer.style.display = 'block';
                found = true;
            } else {
                videoContainer.style.display = 'none';
            }
        });

        if (!found) {
            alert("Tidak ada video yang cocok dengan kata kunci '" + searchTerm + "'.");
        }
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
});
