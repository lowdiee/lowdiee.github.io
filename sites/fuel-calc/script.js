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

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop(); // Initialize

// Obsługa modala
const modal = document.getElementById('calculatorModal');
const openBtn = document.getElementById('openCalculator');
const closeBtn = document.querySelector('.close-modal');

openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Funkcja do obliczania odległości
function calculateDistance(origin, destination, callback) {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC
    }, (response, status) => {
        if (status === 'OK') {
            const distance = response.rows[0].elements[0].distance.value / 1000; // w km
            callback(distance);
        } else {
            console.error('Error calculating distance:', status);
            callback(null);
        }
    });
}

// Inicjalizacja Google Maps API
function initGoogleMaps() {
    const startInput = document.getElementById('start-point');
    const destInput = document.getElementById('destination');
    const calculateBtn = document.getElementById('calculate-btn');
    
    const startAutocomplete = new google.maps.places.Autocomplete(startInput, {
        types: ['geocode']
    });
    
    const destAutocomplete = new google.maps.places.Autocomplete(destInput, {
        types: ['geocode']
    });
    
    calculateBtn.addEventListener('click', function() {
        const startPlace = startInput.value;
        const destPlace = destInput.value;
        
        if (!startPlace || !destPlace) {
            alert('Please enter both start and destination locations');
            return;
        }
        
        calculateDistance(startPlace, destPlace, (distance) => {
            if (distance !== null) {
                const consumption = parseFloat(document.getElementById('fuel-consumption').value);
                const price = parseFloat(document.getElementById('fuel-price').value);
                const passengers = parseInt(document.querySelector('.passenger-btn.active').dataset.passengers);
                
                const fuelNeeded = (distance * consumption) / 100;
                const totalCost = fuelNeeded * price;
                
                document.getElementById('distance').textContent = distance.toFixed(1) + ' km';
                document.getElementById('fuel-needed').textContent = fuelNeeded.toFixed(1) + ' l';
                document.getElementById('total-cost').textContent = totalCost.toFixed(2) + ' PLN';
            } else {
                alert('Could not calculate distance between locations');
            }
        });
    });
}

// Dodaj skrypt Google Maps API
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=TWÓJ_KLUCZ_API&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

loadGoogleMaps();
