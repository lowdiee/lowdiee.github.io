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

// Initialize
setupTimeDisplay();
    // Modal functionality
    const aboutLink = document.querySelector('.about-link');
    const aboutModal = document.getElementById('aboutModal');
    const closeModal = document.getElementById('closeModal');
    const resumeButton = document.getElementById('resumeButton');
    
    if (aboutLink && aboutModal) {
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
    }

    // IMGW API Integration
    async function fetchWeatherData() {
        try {
            const response = await fetch('https://danepubliczne.imgw.pl/api/data/synop');
            const allStations = await response.json();
            
            // Filter active stations with temperature data
            const activeStations = allStations.filter(station => 
                station.temperatura && !isNaN(station.temperatura)
            );
            
            if (activeStations.length === 0) return null;
            
            // Find hottest and coldest
            const hottest = activeStations.reduce((prev, current) => 
                (+prev.temperatura > +current.temperatura) ? prev : current
            );
            
            const coldest = activeStations.reduce((prev, current) => 
                (+prev.temperatura < +current.temperatura) ? prev : current
            );
            
            // Calculate average
            const avgTemp = activeStations.reduce((sum, station) => 
                sum + parseFloat(station.temperatura), 0) / activeStations.length;
            
            return {
                hottestToday: {
                    temp: hottest.temperatura,
                    location: hottest.stacja
                },
                coldestToday: {
                    temp: coldest.temperatura,
                    location: coldest.stacja
                },
                avgTemp: avgTemp.toFixed(1)
            };
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    }

    // Update weather panels
    async function updateWeather() {
        const weatherData = await fetchWeatherData();
        if (weatherData) {
            document.getElementById('hottestTodayTemp').textContent = `${weatherData.hottestToday.temp}°C`;
            document.getElementById('hottestTodayCity').textContent = weatherData.hottestToday.location;
            document.getElementById('coldestTodayTemp').textContent = `${weatherData.coldestToday.temp}°C`;
            document.getElementById('coldestTodayCity').textContent = weatherData.coldestToday.location;
            document.getElementById('avgTemp').textContent = `${weatherData.avgTemp}°C`;
            
            // For demo purposes - in real app you would compare with yesterday's data
            const trend = (Math.random() * 4 - 2).toFixed(1);
            const trendElement = document.getElementById('tempTrend');
            trendElement.textContent = `${trend > 0 ? '+' : ''}${trend}°C`;
            trendElement.style.color = trend > 0 ? '#ff6b6b' : '#4facfe';
        }
        
        // Schedule next update in 1 hour
        setTimeout(updateWeather, 3600000);
    }

    // Initial weather update
    updateWeather();
});
