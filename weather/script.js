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
        const [synopResponse, meteoResponse] = await Promise.all([
            fetch('https://danepubliczne.imgw.pl/api/data/synop'),
            fetch('https://danepubliczne.imgw.pl/api/data/meteo')
        ]);
        
        const synopData = await synopResponse.json();
        const meteoData = await meteoResponse.json();
        
        // Przetwarzanie danych
        const hottestToday = findExtremeTemperature(synopData, 'max');
        const coldestToday = findExtremeTemperature(synopData, 'min');
        const windiest = findWindiestStation(synopData);
        const groundTemp = calculateAverageGroundTemp(meteoData);
        
        // Aktualizacja UI
        updatePanel('hottest-today-temp', `${hottestToday.temp}°C`);
        updatePanel('hottest-today-location', hottestToday.station);
        updatePanel('coldest-today-temp', `${coldestToday.temp}°C`);
        updatePanel('coldest-today-location', coldestToday.station);
        updatePanel('wind-speed', `${windiest.speed} km/h`);
        updatePanel('wind-location', windiest.station);
        updatePanel('ground-temp', `${groundTemp}°C`);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function findExtremeTemperature(data, type) {
    const filtered = data.filter(item => item.temperatura);
    const extreme = filtered.reduce((res, item) => {
        const temp = parseFloat(item.temperatura);
        if (type === 'max') {
            return temp > res.temp ? { temp, station: item.stacja } : res;
        } else {
            return temp < res.temp ? { temp, station: item.stacja } : res;
        }
    }, { temp: type === 'max' ? -Infinity : Infinity, station: '' });
    
    return {
        temp: extreme.temp.toFixed(1),
        station: extreme.station
    };
}

function findWindiestStation(data) {
    const filtered = data.filter(item => item.predkosc_wiatru);
    const windiest = filtered.reduce((max, item) => {
        const speed = parseFloat(item.predkosc_wiatru);
        return speed > max.speed ? { speed, station: item.stacja } : max;
    }, { speed: -Infinity, station: '' });
    
    return {
        speed: windiest.speed.toFixed(1),
        station: windiest.station
    };
}

function calculateAverageGroundTemp(data) {
    const groundTemps = data
        .filter(item => item.temperatura_gruntu)
        .map(item => parseFloat(item.temperatura_gruntu));
    
    const avg = groundTemps.reduce((sum, temp) => sum + temp, 0) / groundTemps.length;
    return avg.toFixed(1);
}

function updatePanel(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}
