const adviceText = document.getElementById('advice-text');
const newAdviceBtn = document.getElementById('new-advice-btn');
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

async function fetchAdvice() {
    try {
        const currentDate = new Date().toISOString();
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are Founders Committee Ventures, a forward-thinking venture capital fund. Provide unique, insightful, and specific advice for startup founders. Draw from various aspects of business such as strategy, finance, marketing, product development, team management, or emerging trends. Each piece of advice should be distinct, creative, and tailored to current challenges in the startup ecosystem. Aim for unconventional wisdom that goes beyond common startup advice. Everyhting should be in 3-5 sentences."
                    },
                    {
                        role: "user",
                        content: `Generate a surprising and thought-provoking piece of startup advice that founders might not have considered before. Make it specific and actionable. Current time: ${currentDate}`
                    }
                ],
                max_tokens: 300,
                temperature: 0.9
            })
        });

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching advice:', error);
        return "Unable to fetch advice at this time. Please try again later.";
    }
}

async function updateAdvice() {
    adviceText.innerHTML = `
        <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    `;
    const advice = await fetchAdvice();
    if (advice === "Unable to fetch advice at this time. Please try again later.") {
        adviceText.innerHTML = `
            <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        `;
    } else {
        adviceText.textContent = advice;
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

newAdviceBtn.addEventListener('click', updateAdvice);

// Initial load
updateAdvice();
updateNews();

// Refresh news every hour
setInterval(updateNews, 3600000);