// Cursor functionality
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorF = document.querySelector('.cursor-f');
    
    if (cursor && cursorF) {
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
        } else {
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
        }
    }

  // Time display functionality
const timeDisplay = document.getElementById('timeDisplay');
let isHovering = false;
let cetInterval, gmtInterval;

function updateCET() {
    const now = new Date();
    const cetOptions = {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    timeDisplay.textContent = `CET ${now.toLocaleTimeString('en-GB', cetOptions)}`;
}

function updateGMT() {
    const now = new Date();
    const gmtOptions = {
        timeZone: 'GMT',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    timeDisplay.textContent = `GMT ${now.toLocaleTimeString('en-GB', gmtOptions)}`;
}

// Initial setup
function setupTimeDisplay() {
    clearInterval(cetInterval);
    clearInterval(gmtInterval);

    if (isHovering) {
        updateGMT();
        gmtInterval = setInterval(updateGMT, 1000);
    } else {
        updateCET();
        cetInterval = setInterval(updateCET, 1000);
    }
}

// Hover effects
timeDisplay.addEventListener('mouseenter', () => {
    isHovering = true;
    setupTimeDisplay();
});

timeDisplay.addEventListener('mouseleave', () => {
    isHovering = false;
    setupTimeDisplay();
});

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = '';

    // Sort cities by temperature (descending)
    const sortedData = [...data].sort((a, b) => b.main.temp - a.main.temp);

    sortedData.forEach((cityData, index) => {
        const isHottest = index === 0;
        const isColdest = index === sortedData.length - 1;

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';

        const weatherIcon = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;

        weatherCard.innerHTML = `
            <div class="flex flex-col h-full">
                ${isHottest ? '<div class="hottest-label">Hottest today</div>' : ''}
                ${isColdest ? '<div class="coldest-label">Coldest today</div>' : ''}
                
                <div class="city-name">${cityData.name}, ${cityData.sys.country}</div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="temperature">${Math.round(cityData.main.temp)}°C</div>
                    <img src="${weatherIcon}" alt="${cityData.weather[0].description}" class="w-16 h-16">
                </div>
                
                <div class="weather-details mt-auto">
                    <div class="detail-item">
                        <span>Feels like:</span>
                        <span>${Math.round(cityData.main.feels_like)}°C</span>
                    </div>
                    <div class="detail-item">
                        <span>Humidity:</span>
                        <span>${cityData.main.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span>Wind:</span>
                        <span>${cityData.wind.speed} m/s</span>
                    </div>
                    <div class="detail-item">
                        <span>Pressure:</span>
                        <span>${cityData.main.pressure} hPa</span>
                    </div>
                </div>
            </div>
        `;

        weatherContainer.appendChild(weatherCard);
    });
}
