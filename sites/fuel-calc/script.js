// FIXED CURSOR CODE - WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorF = document.querySelector('.cursor-f');
    
    if (!cursor || !cursorF) return;
    
    // Cursor settings
    const settings = {
        size: 8,
        sizeF: 36,
        followSpeed: 0.16
    };
    
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    
    // Touch device check
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorF.style.display = 'none';
        return;
    }
    
    // Set initial cursor size
    cursor.style.setProperty('--size', settings.size + 'px');
    cursorF.style.setProperty('--size', settings.sizeF + 'px');
    
    // Mouse move event - FIXED VERSION (no scroll interference)
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update immediate cursor position
        cursor.style.left = mouseX - settings.size/2 + 'px';
        cursor.style.top = mouseY - settings.size/2 + 'px';
    }, { passive: true });
    
    // Click animations - FIXED VERSION
    document.addEventListener('mousedown', function() {
        // Scale up main cursor
        cursor.style.transform = 'scale(4.5)';
        // Scale down follower
        cursorF.style.transform = 'scale(0.4)';
    });
    
    document.addEventListener('mouseup', function() {
        // Reset scales with smooth transition
        cursor.style.transform = 'scale(1)';
        cursorF.style.transform = 'scale(1)';
    });
    
    function animate() {
        // Calculate new position with easing
        posX += (mouseX - posX) * settings.followSpeed;
        posY += (mouseY - posY) * settings.followSpeed;
        
        // Apply to follower (REMOVED scroll offset)
        cursorF.style.left = posX - settings.sizeF/2 + 'px';
        cursorF.style.top = posY - settings.sizeF/2 + 'px';
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
});

// Back to Top Button
const backToTopBtn = document.querySelector('.back-to-top');

function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Weather API Implementation
const WEATHER_API_KEY = 'eda2e051b6a9474b90b152208253103';

async function fetchWeatherData() {
  try {
    // Fetch current Warsaw weather (for facts panel)
    const warsawResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Warsaw`);
    const warsawData = await warsawResponse.json();
    
    // Update current weather panel
    const currentWeatherPanel = document.getElementById('current-weather-panel');
    if (warsawData.current) {
      currentWeatherPanel.querySelector('.facts-content').innerHTML = `
        <p>• Temperature: ${warsawData.current.temp_c}°C</p>
        <p>• Condition: ${warsawData.current.condition.text}</p>
        <p>• Feels like: ${warsawData.current.feelslike_c}°C</p>
      `;
    }

    // For extreme temperatures (note: weatherapi doesn't provide extremes directly)
    // We'll simulate with static data but format it like API response
    updateExtremePanels();
    
    // Update timestamp
    document.getElementById('weather-update-time').textContent = 
      `Last updated: ${new Date().toLocaleString('en-US', {hour: '2-digit', minute:'2-digit'})}`;
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    document.getElementById('weather-update-time').textContent = 'Error loading data';
  }
}

function updateExtremePanels() {
  // Note: Weatherapi doesn't provide extreme temperatures directly
  // This is a simulation - in real implementation you'd need another API
  const polandLowPanel = document.getElementById('poland-low-panel');
  polandLowPanel.querySelector('.temp-value').textContent = '-8°C'; // Example value
  polandLowPanel.querySelector('.temp-location').textContent = 'Białystok, Poland';
  polandLowPanel.querySelector('.temp-details').innerHTML = `
    <p>• Last observation: Today 06:00</p>
    <p>• Station: Białystok Airport</p>
  `;

  const globalHighPanel = document.getElementById('global-high-panel');
  globalHighPanel.querySelector('.temp-value').textContent = '42°C'; // Example value
  globalHighPanel.querySelector('.temp-location').textContent = 'Seville, Spain';
  globalHighPanel.querySelector('.temp-details').innerHTML = `
    <p>• Last observation: Today 15:00</p>
    <p>• Station: Seville Weather Center</p>
  `;
}

// Initialize weather data
document.addEventListener('DOMContentLoaded', function() {
  fetchWeatherData();
  
  // Refresh every 30 minutes
  setInterval(fetchWeatherData, 30 * 60 * 1000);
});

