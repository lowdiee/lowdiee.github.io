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

// Add this to your script.js
document.addEventListener('DOMContentLoaded', function() {
  // ... your existing code ...
  
  // Weather API Integration
  const API_KEY = 'eda2e051b6a9474b90b152208253103';
  
  // Static data (weatherapi doesn't provide global extremes)
  const weatherData = {
    global: {
      high: { temp: '56.7°C', location: 'Furnace Creek, USA', date: '1913-07-10' },
      low: { temp: '-89.2°C', location: 'Vostok Station, Antarctica', date: '1983-07-21' }
    },
    poland: {
      high: { temp: '40.2°C', location: 'Pruszków', date: '2023-07-19' },
      low: { temp: '-41.0°C', location: 'Siedlce', date: '1940-01-11' }
    }
  };
  
  // Update weather widget
  function updateWeatherWidget() {
    document.getElementById('global-high').textContent = weatherData.global.high.temp;
    document.getElementById('global-high-loc').textContent = weatherData.global.high.location;
    document.getElementById('global-low').textContent = weatherData.global.low.temp;
    document.getElementById('global-low-loc').textContent = weatherData.global.low.location;
    
    document.getElementById('poland-high').textContent = weatherData.poland.high.temp;
    document.getElementById('poland-high-loc').textContent = weatherData.poland.high.location;
    document.getElementById('poland-low').textContent = weatherData.poland.low.temp;
    document.getElementById('poland-low-loc').textContent = weatherData.poland.low.location;
    
    const now = new Date();
    document.getElementById('weather-date').textContent = `Updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  
  // For actual API calls (example for Poland's current weather)
  async function fetchPolandWeather() {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Poland`);
      const data = await response.json();
      console.log('Current Poland weather:', data);
      // You could update some elements here if needed
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  }
  
  // Initialize
  updateWeatherWidget();
  // fetchPolandWeather(); // Uncomment if you want live Poland data
});
window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop(); // Initialize

