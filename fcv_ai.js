// Dark mode initialization
function initDarkMode() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

    // Set initial theme
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleLightIconMobile.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleDarkIconMobile.classList.remove('hidden');
    }

    // Function to toggle theme
    function toggleTheme() {
        // Toggle icons for both desktop and mobile
        [themeToggleDarkIcon, themeToggleDarkIconMobile].forEach(icon => icon.classList.toggle('hidden'));
        [themeToggleLightIcon, themeToggleLightIconMobile].forEach(icon => icon.classList.toggle('hidden'));

        // Toggle dark mode
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }

    // Add click handlers to both buttons
    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleBtnMobile.addEventListener('click', toggleTheme);
}

// Initialize dark mode
initDarkMode();

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
                const link = story.url ? `<a href="${story.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Read more</a>` : '';
                const userLink = `<a href="https://news.ycombinator.com/user?id=${story.by}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">${story.by}</a>`;
                return `<div class="mb-4 last:mb-0 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">${story.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Posted by ${userLink}</p>
                    <div class="mt-2 flex justify-between items-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">Score: ${story.score}</span>
                        ${link}
                    </div>
                </div>`;
            }).join('');

            slidesHTML.push(`<div class="carousel-slide w-full flex-shrink-0 px-4">${storyList}</div>`);
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
        newsDate.textContent = `HN Top Stories - ${currentDate}`;
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

document.querySelector('.carousel-container').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.querySelector('.carousel-container').addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

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