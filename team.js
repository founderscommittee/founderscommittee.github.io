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
    teamMembers.forEach(member => {
        // Create team member card
        const card = document.createElement('div');
        card.className = 'text-center';
        
        // Build social links HTML
        let socialLinksHTML = '';
        if (member.social.linkedin) {
            socialLinksHTML += `
                <a href="${member.social.linkedin}" target="_blank"
                    class="text-gray-600 hover:text-blue-500 transition-colors">
                    <i class="fab fa-linkedin text-2xl"></i>
                </a>
            `;
        }
        
        if (member.social.twitter) {
            socialLinksHTML += `
                <a href="${member.social.twitter}" target="_blank"
                    class="text-gray-600 hover:text-blue-500 transition-colors">
                    <i class="fa-brands fa-square-twitter text-2xl"></i>
                </a>
            `;
        }
        
        if (member.social.spotify) {
            socialLinksHTML += `
                <a href="${member.social.spotify}" target="_blank" 
                    class="text-gray-600 hover:text-blue-500 transition-colors">
                    <i class="fab fa-spotify text-2xl"></i>
                </a>
            `;
        }
        
        // Build expertise tags HTML
        let expertiseTagsHTML = '';
        member.expertise.forEach(tag => {
            expertiseTagsHTML += `
                <span class="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">${tag}</span>
            `;
        });
        
        card.innerHTML = `
            <div class="relative mb-6 inline-block">
                <div class="absolute inset-0 bg-blue-500 rounded-full opacity-10 transform -rotate-6"></div>
                <img src="${member.image}" alt="${member.name}"
                    class="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg">
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">${member.name}</h3>
            <p class="text-lg text-blue-600 dark:text-blue-400 mb-3">${member.title}</p>
            <div class="flex flex-wrap justify-center gap-2 mb-4">
                ${expertiseTagsHTML}
            </div>
            <div class="flex justify-center space-x-4">
                ${socialLinksHTML}
            </div>
        `;
        
        teamGrid.appendChild(card);
    });
} 