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
// IMGW API Implementation
async function fetchIMGWData() {
  try {
    // Pobierz dane z IMGW (API synoptyczne - ostatnia doba)
    const response = await fetch('https://danepubliczne.imgw.pl/api/data/synop');
    const data = await response.json();
    
    // Znajdź ekstrema
    const sortedByMin = [...data].sort((a, b) => a.temperatura - b.temperatura);
    const sortedByMax = [...data].sort((a, b) => b.temperatura - a.temperatura);
    
    const minTemp = sortedByMin[0];
    const maxTemp = sortedByMax[0];
    
    // Aktualizuj UI
    document.getElementById('poland-min-temp').textContent = `${minTemp.temperatura}°C`;
    document.getElementById('poland-min-loc').textContent = minTemp.stacja;
    document.getElementById('poland-min-time').textContent = `• Godzina: ${minTemp.godzina_pomiaru}:00`;
    
    document.getElementById('poland-max-temp').textContent = `${maxTemp.temperatura}°C`;
    document.getElementById('poland-max-loc').textContent = maxTemp.stacja;
    document.getElementById('poland-max-time').textContent = `• Godzina: ${maxTemp.godzina_pomiaru}:00`;
    
    document.getElementById('update-time').textContent = new Date().toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
  } catch (error) {
    console.error('IMGW API Error:', error);
    document.getElementById('poland-min-loc').textContent = 'Błąd ładowania';
    document.getElementById('poland-max-loc').textContent = 'Błąd ładowania';
  }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
  fetchIMGWData();
  setInterval(fetchIMGWData, 60 * 60 * 1000); // Aktualizuj co godzinę (IMGW aktualizuje dane co 1-3h)
});
