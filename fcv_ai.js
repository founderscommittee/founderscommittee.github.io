const newsContainer = document.getElementById('news-container');
const newsSkeleton = document.getElementById('news-skeleton');
const newsDate = document.getElementById('news-date');

async function fetchHackerNews() {
    try {
        const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds = await topStoriesResponse.json();
        
        const storyPromises = topStoryIds.slice(0, 10).map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        return await Promise.all(storyPromises);
    } catch (error) {
        console.error('Error fetching Hacker News:', error);
        return [];
    }
}

async function updateNews() {
    newsSkeleton.style.display = 'block';
    newsContainer.textContent = '';
    newsDate.textContent = '';

    const stories = await fetchHackerNews();
    if (stories.length > 0) {
        newsSkeleton.style.display = 'none';
        
        const storyList = stories.map(story => {
            const link = story.url ? `<a href="${story.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Read more</a>` : '';
            const userLink = `<a href="https://news.ycombinator.com/user?id=${story.by}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${story.by}</a>`;
            return `<li class="mb-4">
                <strong>${story.title}</strong> <span class="text-sm text-gray-500">(Score: ${story.score})</span><br>
                by ${userLink} | ${link}
            </li>`;
        }).join('');

        newsContainer.innerHTML = `<ol class="list-decimal list-inside">${storyList}</ol>`;

        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        newsDate.textContent = `Top 10 Hacker News Stories as of ${currentDate}`;
    } else {
        newsSkeleton.style.display = 'none';
        newsContainer.textContent = "No startup news available at this time.";
    }
}

// Initial load
updateNews();

// Refresh news every 10 minutes
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