function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getTimeAgo(unixTime) {
    const seconds = Math.floor(Date.now() / 1000 - unixTime);
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

// Remove any existing dark mode implementation to avoid conflicts with animations.js
// Other functionality in this file will remain unchanged

const newsContainer = document.getElementById('news-container');
const newsSkeleton = document.getElementById('news-skeleton');
const newsDate = document.getElementById('news-date');

async function fetchHackerNews() {
    try {
        const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds = await topStoriesResponse.json();

        const storyPromises = topStoryIds.slice(0, 20).map(id =>  // Changed from 10 to 20
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );

        return await Promise.all(storyPromises);
    } catch (error) {
        console.error('Error fetching Hacker News:', error);
        return [];
    }
}

let currentSlide = 0;
let totalSlides = 0;

async function updateNews() {
    const newsContainer = document.getElementById('news-container');
    const newsSkeleton = document.getElementById('news-skeleton');
    const newsDate = document.getElementById('news-date');

    newsSkeleton.style.display = 'block';
    newsContainer.innerHTML = '';
    newsDate.textContent = '';

    const stories = await fetchHackerNews();
    if (stories.length > 0) {
        newsSkeleton.style.display = 'none';

        // Create slides with 5 stories each instead of 3
        const slidesHTML = [];
        for (let i = 0; i < stories.length; i += 5) {  // Changed from 3 to 5
            const slideStories = stories.slice(i, i + 5);
            const storyList = slideStories.map(story => {
                const timeAgo = story.time ? getTimeAgo(story.time) : '';
                const safeTitle = escapeHtml(story.title || '');
                const safeBy = escapeHtml(story.by || '');
                const titleEl = story.url
                    ? '<a href="' + escapeHtml(story.url) + '" target="_blank" rel="noopener noreferrer" class="news-item-title">' + safeTitle + '</a>'
                    : '<span class="news-item-title">' + safeTitle + '</span>';
                return '<div class="news-item"><div class="news-item-left">' + titleEl +
                    '<span class="news-item-meta">' + (story.score || 0) + ' pts · ' + (story.descendants || 0) + ' comments · by ' + safeBy + '</span>' +
                    '</div><span class="news-item-time">' + timeAgo + '</span></div>';
            }).join('');

            slidesHTML.push('<div class="news-slide">' + storyList + '</div>');
        }

        newsContainer.innerHTML = slidesHTML.join('');
        totalSlides = slidesHTML.length;

        // Update carousel indicators
        updateCarouselIndicators();

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        newsDate.textContent = 'Top stories from the tech and startup world · ' + currentDate;
    }
}

function updateCarouselIndicators() {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-blue-600 w-4' : 'bg-gray-300'}`;
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function goToSlide(index) {
    const track = document.getElementById('news-container');
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateCarouselIndicators();
}

function setupCarouselControls() {
    document.getElementById('prev-slide').addEventListener('click', () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    });

    document.getElementById('next-slide').addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    });
}

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselEl = document.querySelector('.carousel-container');
if (carouselEl) {
    carouselEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, false);
    carouselEl.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, false);
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
            // Swipe left
            goToSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
            // Swipe right
            goToSlide(currentSlide - 1);
        }
    }
}

// Initialize carousel
setupCarouselControls();
updateNews();

// Auto-update news every 10 minutes
setInterval(updateNews, 600000);

// Add section animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-4');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-animate').forEach((section) => {
    observer.observe(section);
});

// Add Konami code detector
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            new SnakeGame();
        }
    } else {
        konamiIndex = 0;
    }
});