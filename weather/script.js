<script>
// Modal functionality
const aboutLink = document.querySelector('.about-link');
const aboutModal = document.getElementById('aboutModal');
const closeModal = document.getElementById('closeModal');
const resumeButton = document.getElementById('resumeButton');

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    aboutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

resumeButton.addEventListener('click', () => {
    aboutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
        aboutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Weather data
async function fetchWeatherData() {
    // Simulate API call
    return {
        hottestToday: {
            temp: Math.round(Math.random() * 10 + 20), // 20-30°C
            location: ["Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk"][Math.floor(Math.random() * 5)]
        },
        coldestToday: {
            temp: Math.round(Math.random() * 10 - 5), // -5 to 5°C
            location: ["Zakopane", "Suwałki", "Białystok", "Kasprowy Wierch", "Śnieżka"][Math.floor(Math.random() * 5)]
        },
        avgTemp: Math.round(Math.random() * 10 + 10), // 10-20°C
        trend: Math.round(Math.random() * 4 - 2) // -2 to +2°C
    };
}

function updateWeatherPanels(data) {
    // Hottest today
    document.querySelector('#hottestToday .temp').textContent = `${data.hottestToday.temp}°C`;
    document.querySelector('#hottestToday .location').textContent = data.hottestToday.location;
    
    // Coldest today
    document.querySelector('#coldestToday .temp').textContent = `${data.coldestToday.temp}°C`;
    document.querySelector('#coldestToday .location').textContent = data.coldestToday.location;
    
    // Average temp
    document.querySelector('#avgTemp .temp').textContent = `${data.avgTemp}°C`;
    
    // Trend
    const trendElement = document.querySelector('#tempTrend .temp');
    const trendIcon = document.querySelector('#tempTrend .trend-icon');
    trendElement.textContent = `${Math.abs(data.trend)}°C`;
    
    if(data.trend > 0) {
        trendElement.style.color = '#ff6b6b';
        trendIcon.textContent = '↑';
        trendIcon.style.color = '#ff6b6b';
    } else if(data.trend < 0) {
        trendElement.style.color = '#4facfe';
        trendIcon.textContent = '↓';
        trendIcon.style.color = '#4facfe';
    } else {
        trendElement.style.color = '#aaa';
        trendIcon.textContent = '→';
        trendIcon.style.color = '#aaa';
    }
}

// Update weather data
async function updateWeather() {
    const data = await fetchWeatherData();
    updateWeatherPanels(data);
    
    // Schedule next update in 1 hour
    setTimeout(updateWeather, 3600000);
    
    // Show last update time
    const now = new Date();
    console.log(`Last update: ${now.toLocaleTimeString()}`);
}

// Initial load
updateWeather();
</script>
