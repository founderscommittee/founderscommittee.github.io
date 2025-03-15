document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
});

async function loadPortfolioData() {
    try {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const portfolioData = await response.json();
        displayPortfolioItems(portfolioData);
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.getElementById('portfolio-grid').innerHTML = `
            <div class="col-span-full text-center">
                <p class="text-red-500">Failed to load portfolio data. Please try again later.</p>
            </div>
        `;
    }
}

function displayPortfolioItems(portfolioItems) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    // Clear any existing content
    portfolioGrid.innerHTML = '';
    
    // Create and append portfolio item cards
    portfolioItems.forEach(item => {
        // Determine status class
        let statusClass = 'bg-green-100 text-green-800';
        if (item.status === 'Acquired') {
            statusClass = 'bg-yellow-100 text-yellow-800';
        } else if (item.status.includes('Nasdaq')) {
            statusClass = 'bg-pink-100 text-pink-800';
        }
        
        // Determine stage class
        let stageClass = 'bg-purple-100 text-purple-800';
        if (item.stage === 'Seed') {
            stageClass = 'bg-indigo-100 text-indigo-800';
        } else if (item.stage === 'Series A') {
            stageClass = 'bg-blue-100 text-blue-800';
        }
        
        // Create portfolio item card
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1';
        
        card.innerHTML = `
            <div class="p-8">
                <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">${item.name}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">${item.description}</p>
                <div class="space-y-2">
                    <span class="inline-block px-3 py-1 text-sm font-medium ${stageClass} rounded-full mr-2">${item.stage}</span>
                    <span class="inline-block px-3 py-1 text-sm font-medium ${statusClass} rounded-full">${item.status}</span>
                </div>
            </div>
            <div class="px-8 pb-6">
                <a href="${item.website}" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                    ${item.websiteLabel || 'Visit Website'} 
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        `;
        
        portfolioGrid.appendChild(card);
    });
} 