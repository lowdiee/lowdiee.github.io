// Dane pogodowe (symulacja API)
async function fetchWeatherData() {
    // W rzeczywistości tutaj byłoby prawdziwe połączenie z API
    return {
        hottestToday: {
            temp: Math.round(Math.random() * 10 + 20), // 20-30°C
            location: ["Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk"][Math.floor(Math.random() * 5)]
        },
        coldestToday: {
            temp: Math.round(Math.random() * 10 - 5), // -5 do 5°C
            location: ["Zakopane", "Suwałki", "Białystok", "Kasprowy Wierch", "Śnieżka"][Math.floor(Math.random() * 5)]
        },
        avgTemp: Math.round(Math.random() * 10 + 10), // 10-20°C
        trend: Math.round(Math.random() * 4 - 2) // -2 do +2°C
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

// Aktualizacja co godzinę
async function updateWeather() {
    const data = await fetchWeatherData();
    updateWeatherPanels(data);
}

// Pierwsze ładowanie
updateWeather();

// Ustawienie interwału co godzinę
setInterval(updateWeather, 3600000); // 3600000 ms = 1 godzina
