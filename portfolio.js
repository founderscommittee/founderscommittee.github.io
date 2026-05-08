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
        const grid = document.getElementById('portfolio-grid');
        grid.style.cssText = 'grid-column:1/-1;text-align:center;padding:48px 0;color:var(--ink-secondary);font-size:14px;';
        grid.textContent = 'Failed to load portfolio data. Please try again later.';
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
    const portfolioItems = document.querySelectorAll('#portfolio-grid .logo-tile');
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
    portfolioGrid.innerHTML = '';

    if (portfolioItems.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:48px 0;';
        empty.textContent = 'No portfolio items match your filter.';
        portfolioGrid.appendChild(empty);
        return;
    }

    portfolioItems.forEach(item => {
        const isExit = item.status === 'Acquired' || item.status.includes(':');
        const stageLabel = isExit ? item.status : item.stage;

        const tile = document.createElement('a');
        tile.className = 'logo-tile stagger-item';
        tile.href = item.website;
        tile.target = '_blank';
        tile.rel = 'noopener noreferrer';

        const name = document.createElement('span');
        name.className = 'logo-tile-name';
        name.textContent = item.name;

        const desc = document.createElement('span');
        desc.className = 'logo-tile-desc';
        desc.textContent = item.description;

        const stage = document.createElement('span');
        stage.className = 'logo-tile-stage' + (isExit ? ' exit' : '');
        stage.textContent = stageLabel;

        tile.appendChild(name);
        tile.appendChild(desc);
        tile.appendChild(stage);
        portfolioGrid.appendChild(tile);
    });
} 