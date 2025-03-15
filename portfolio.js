document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
    
    // Set up portfolio filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter portfolio items
            const filter = button.getAttribute('data-filter');
            filterPortfolioItems(filter);
        });
    });
});

async function loadPortfolioData() {
    try {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const portfolioData = await response.json();
        displayPortfolioItems(portfolioData);
        
        // Store the data for filtering
        window.portfolioData = portfolioData;
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.getElementById('portfolio-grid').innerHTML = `
            <div class="col-span-full text-center">
                <p class="text-red-500">Failed to load portfolio data. Please try again later.</p>
            </div>
        `;
    }
}

function filterPortfolioItems(filter) {
    if (!window.portfolioData) return;
    
    const filteredData = filter === 'all' 
        ? window.portfolioData 
        : window.portfolioData.filter(item => 
            item.stage === filter || item.status === filter
        );
    
    displayPortfolioItems(filteredData);
    
    // Add animation to newly displayed items
    const portfolioItems = document.querySelectorAll('#portfolio-grid > div');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100); // Stagger the animations
    });
}

function displayPortfolioItems(portfolioItems) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    // Clear any existing content
    portfolioGrid.innerHTML = '';
    
    // Create and append portfolio item cards
    portfolioItems.forEach(item => {
        // Determine status class
        let statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (item.status === 'Acquired') {
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        } else if (item.status.includes('Nasdaq')) {
            statusClass = 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
        }
        
        // Determine stage class
        let stageClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        if (item.stage === 'Pre-Seed') {
            stageClass = 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
        } else if (item.stage === 'Seed') {
            stageClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
        } else if (item.stage === 'Series A') {
            stageClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        }
        
        // Create portfolio item card
        const card = document.createElement('div');
        card.className = 'card stagger-item';
        
        // Add a subtle gradient overlay to the top of the card
        const gradientOverlay = item.status === 'Acquired' 
            ? 'from-yellow-500' 
            : item.stage === 'Pre-Seed'
                ? 'from-teal-500'
                : item.stage === 'Seed' 
                    ? 'from-indigo-500' 
                    : 'from-blue-500';
        
        card.innerHTML = `
            <div class="card-accent bg-gradient-to-r ${gradientOverlay} to-primary"></div>
            <div class="p-6 md:p-8 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">${item.name}</h3>
                    <span class="inline-block px-3 py-1 text-sm font-medium ${statusClass} rounded-full ml-2">${item.status}</span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 mb-4 flex-grow">${item.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="inline-block px-3 py-1 text-sm font-medium ${stageClass} rounded-full">${item.stage}</span>
                </div>
            </div>
            <div class="px-6 md:px-8 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                <a href="${item.website}" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center hover-lift">
                    ${item.websiteLabel || 'Visit Website'} 
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </a>
            </div>
        `;
        
        portfolioGrid.appendChild(card);
    });
    
    // Show "No results" message if no items match the filter
    if (portfolioItems.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-xl text-gray-600 dark:text-gray-400">No portfolio items match your filter.</p>
                <button class="filter-btn mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" data-filter="all">
                    Show All
                </button>
            </div>
        `;
        
        // Re-attach event listener to the "Show All" button
        document.querySelector('#portfolio-grid .filter-btn').addEventListener('click', () => {
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            allButton.click();
        });
    }
    
    // If there are fewer than 3 portfolio items, add placeholder cards to maintain grid layout
    const currentCount = portfolioItems.length;
    if (currentCount > 0 && currentCount < 3) {
        const placeholdersNeeded = 3 - currentCount;
        
        for (let i = 0; i < placeholdersNeeded; i++) {
            const placeholderCard = document.createElement('div');
            placeholderCard.className = 'bg-transparent';
            portfolioGrid.appendChild(placeholderCard);
        }
    }
} 