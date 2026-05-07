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
    teamGrid.innerHTML = '';

    const iconMap = { linkedin: 'fa-linkedin-in', twitter: 'fa-twitter', spotify: 'fa-spotify' };

    teamMembers.forEach((member, index) => {
        const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

        const card = document.createElement('div');
        card.className = 'team-card stagger-item';

        const avatar = document.createElement('div');
        avatar.className = 'team-avatar';
        avatar.textContent = initials;

        const name = document.createElement('div');
        name.className = 'team-name';
        name.textContent = member.name;

        const title = document.createElement('div');
        title.className = 'team-title';
        title.textContent = member.title;

        const tags = document.createElement('div');
        tags.className = 'team-tags';
        member.expertise.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'team-tag';
            span.textContent = tag;
            tags.appendChild(span);
        });

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(title);
        card.appendChild(tags);

        const socialEntries = Object.entries(member.social).filter(([, url]) => url);
        if (socialEntries.length > 0) {
            const social = document.createElement('div');
            social.className = 'team-social';
            socialEntries.forEach(([platform, url]) => {
                const icon = iconMap[platform];
                if (!icon) return;
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'team-social-link';
                const i = document.createElement('i');
                i.className = 'fab ' + icon;
                a.appendChild(i);
                social.appendChild(a);
            });
            card.appendChild(social);
        }

        teamGrid.appendChild(card);
    });
} 