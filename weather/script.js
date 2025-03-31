// Custom cursor implementation
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorF = document.querySelector('.cursor-f');
    
    if (!cursor || !cursorF) return;
    
    const settings = {
        size: 8,
        sizeF: 36,
        followSpeed: 0.16
    };
    
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorF.style.display = 'none';
        return;
    }
    
    cursor.style.setProperty('--size', settings.size + 'px');
    cursorF.style.setProperty('--size', settings.sizeF + 'px');
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - settings.size/2 + 'px';
        cursor.style.top = mouseY - settings.size/2 + 'px';
    }, { passive: true });
    
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'scale(4.5)';
        cursorF.style.transform = 'scale(0.4)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'scale(1)';
        cursorF.style.transform = 'scale(1)';
    });
    
    function animate() {
        posX += (mouseX - posX) * settings.followSpeed;
        posY += (mouseY - posY) * settings.followSpeed;
        cursorF.style.left = posX - settings.sizeF/2 + 'px';
        cursorF.style.top = posY - settings.sizeF/2 + 'px';
        requestAnimationFrame(animate);
    }
    animate();
    
    fetchWeatherData();
});

async function fetchWeatherData() {
    try {
        const response = await fetch('https://danepubliczne.imgw.pl/api/data/synop');
        const allStations = await response.json();
        
        // Przetwarzanie danych
        const processedData = processWeatherData(allStations);
        updateWeatherUI(processedData);
        
        // Aktualizuj co godzinę
        setTimeout(fetchWeatherData, 3600000);
    } catch (error) {
        console.error("Błąd pobierania danych:", error);
        setTimeout(fetchWeatherData, 300000); // Ponów próbę po 5 minutach
    }
}

function processWeatherData(stations) {
    // Filtruj tylko stacje aktywne i z kompletem danych
    const validStations = stations.filter(station => 
        station.temperatura && station.stacja
    );
    
    // Znajdź najwyższą i najniższą temperaturę
    const hottest = validStations.reduce((max, station) => 
        parseFloat(station.temperatura) > parseFloat(max.temperatura) ? station : max
    );
    
    const coldest = validStations.reduce((min, station) => 
        parseFloat(station.temperatura) < parseFloat(min.temperatura) ? station : min
    );
    
    // Oblicz średnią temperaturę
    const avgTemp = validStations.reduce((sum, station) => 
        sum + parseFloat(station.temperatura), 0) / validStations.length;
    
    // Oblicz trend (uproszczone - porównanie z poprzednim dniem)
    // UWAGA: To wymagałoby zapisywania poprzednich danych
    const trend = {
        change: 0, // Tymczasowo 0 - potrzebne byłoby przechowywanie historii
        description: "Brak danych historycznych"
    };
    
    return {
        hottestToday: {
            temp: hottest.temperatura,
            location: hottest.stacja,
            time: new Date()
        },
        coldestToday: {
            temp: coldest.temperatura,
            location: coldest.stacja,
            time: new Date()
        },
        trend: trend,
        average: {
            temp: avgTemp,
            time: new Date()
        }
    };
}

function updateWeatherUI(data) {
    // Aktualizuj najcieplejsze miejsce
    document.getElementById('hottest-today-temp').textContent = `${data.hottestToday.temp}°C`;
    document.getElementById('hottest-today-location').textContent = data.hottestToday.location;
    document.getElementById('hottest-today-time').textContent = `Updated: ${formatTime(data.hottestToday.time)}`;
    
    // Aktualizuj najzimniejsze miejsce
    document.getElementById('coldest-today-temp').textContent = `${data.coldestToday.temp}°C`;
    document.getElementById('coldest-today-location').textContent = data.coldestToday.location;
    document.getElementById('coldest-today-time').textContent = `Updated: ${formatTime(data.coldestToday.time)}`;
    
    // Aktualizuj trend
    const trendElement = document.getElementById('trend-temp');
    trendElement.innerHTML = `<span>${data.trend.change > 0 ? '+' : ''}${data.trend.change.toFixed(1)}°C</span>`;
    document.getElementById('trend-description').textContent = data.trend.description;
    document.getElementById('trend-time').textContent = `Updated: ${formatTime(data.trend.time)}`;
    
    // Aktualizuj średnią
    document.getElementById('avg-temp').textContent = `${data.average.temp.toFixed(1)}°C`;
    document.getElementById('avg-time').textContent = `Updated: ${formatTime(data.average.time)}`;
}

function formatTime(date) {
    return date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
}
