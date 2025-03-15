document.addEventListener('DOMContentLoaded', () => {
    loadTeamData();
});

async function loadTeamData() {
    try {
        const response = await fetch('data/team.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const teamData = await response.json();
        displayTeamMembers(teamData);
    } catch (error) {
        console.error('Error loading team data:', error);
        document.getElementById('team-grid').innerHTML = `
            <div class="col-span-full text-center">
                <p class="text-red-500">Failed to load team data. Please try again later.</p>
            </div>
        `;
    }
}

function displayTeamMembers(teamMembers) {
    const teamGrid = document.getElementById('team-grid');
    
    // Clear any existing content
    teamGrid.innerHTML = '';
    
    // Create and append team member cards
    teamMembers.forEach((member, index) => {
        // Create team member card
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-hover h-full flex flex-col transform transition-all duration-300';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Build social links HTML
        let socialLinksHTML = '';
        if (member.social.linkedin) {
            socialLinksHTML += `
                <a href="${member.social.linkedin}" target="_blank"
                    class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors hover-lift">
                    <i class="fab fa-linkedin text-xl"></i>
                </a>
            `;
        }
        
        if (member.social.twitter) {
            socialLinksHTML += `
                <a href="${member.social.twitter}" target="_blank"
                    class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors hover-lift">
                    <i class="fa-brands fa-square-twitter text-xl"></i>
                </a>
            `;
        }
        
        if (member.social.spotify) {
            socialLinksHTML += `
                <a href="${member.social.spotify}" target="_blank" 
                    class="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors hover-lift">
                    <i class="fab fa-spotify text-xl"></i>
                </a>
            `;
        }
        
        // Build expertise tags HTML
        let expertiseTagsHTML = '';
        member.expertise.forEach(tag => {
            expertiseTagsHTML += `
                <span class="inline-block px-2 py-1 m-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">${tag}</span>
            `;
        });
        
        // Determine background accent color
        const colors = ['blue', 'indigo', 'purple', 'pink', 'green'];
        const colorIndex = index % colors.length;
        const accentColor = colors[colorIndex];
        
        // Create a more visually impactful card with consistent sizing
        card.innerHTML = `
            <div class="relative h-full flex flex-col">
                <div class="absolute inset-0 bg-gradient-to-br from-${accentColor}-500/20 to-transparent"></div>
                <div class="bg-gradient-to-r from-${accentColor}-500/10 to-transparent h-2 w-full absolute top-0 left-0"></div>
                <div class="p-6 md:p-8 flex flex-col items-center text-center relative z-10 h-full">
                    <div class="relative mb-5 inline-block img-hover-zoom">
                        <div class="absolute inset-0 bg-${accentColor}-500 rounded-full opacity-10 transform -rotate-6"></div>
                        <img src="${member.image}" alt="${member.name}"
                            class="relative w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg mx-auto">
                    </div>
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">${member.name}</h3>
                    <p class="text-md md:text-lg text-${accentColor}-600 dark:text-${accentColor}-400 mb-3">${member.title}</p>
                    <div class="flex flex-wrap justify-center gap-1 mb-4">
                        ${expertiseTagsHTML}
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-5 flex-grow">
                        ${member.bio || ''}
                    </p>
                    <div class="flex justify-center space-x-4 pt-3 border-t border-gray-100 dark:border-gray-700 w-full mt-auto">
                        ${socialLinksHTML}
                    </div>
                </div>
            </div>
        `;
        
        teamGrid.appendChild(card);
        
        // Animate cards with a staggered delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // If there are fewer than 3 team members, add placeholder cards to maintain grid layout
    const currentCount = teamMembers.length;
    if (currentCount < 3) {
        const placeholdersNeeded = 3 - currentCount;
        
        for (let i = 0; i < placeholdersNeeded; i++) {
            const placeholderCard = document.createElement('div');
            placeholderCard.className = 'bg-transparent';
            teamGrid.appendChild(placeholderCard);
        }
    }
} 