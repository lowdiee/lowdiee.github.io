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

// 👇 PODMIEN SWÓJ KLUCZ API Z GEOAPIFY
const GEOAPIFY_API_KEY = "twój_klucz_api";

// Autouzupełnianie miejscowości
function setupAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  
  input.addEventListener("input", function() {
    const query = input.value.trim();
    if (query.length < 3) return; // Minimalna długość zapytania

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!data.features) return;
        
        // Wyświetl sugestie (np. w dropdown)
        console.log("Sugestie dla", inputId, data.features.map(f => f.properties.formatted));
        // Tutaj możesz dodać UI do wyboru sugestii (np. kliknięcie ustawia wartość inputa)
      })
      .catch(err => console.error("Błąd autouzupełniania:", err));
  });
}

// Oblicz odległość między punktami (w km)
function calculateDistance(startPlace, endPlace, callback) {
  fetch(`https://api.geoapify.com/v1/routing?waypoints=${encodeURIComponent(startPlace)}|${encodeURIComponent(endPlace)}&apiKey=${GEOAPIFY_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data.features || data.features.length === 0) {
        console.error("Nie znaleziono trasy!");
        callback(null);
        return;
      }
      
      const distanceKm = data.features[0].properties.distance / 1000; // Konwersja na km
      callback(distanceKm);
    })
    .catch(err => {
      console.error("Błąd obliczania trasy:", err);
      callback(null);
    });
}

// 👇 INTEGRACJA Z TWOIM KALKULATOREM PALIWA
document.addEventListener("DOMContentLoaded", function() {
  // Inicjalizacja autouzupełniania dla pól "start" i "end"
  setupAutocomplete("miasto-start"); // Zmień ID na swoje
  setupAutocomplete("miasto-end");   // Zmień ID na swoje

  // Po kliknięciu przycisku "Oblicz" (dostosuj do swojego HTML)
  document.getElementById("oblicz-button").addEventListener("click", function() {
    const start = document.getElementById("miasto-start").value;
    const end = document.getElementById("miasto-end").value;

    if (!start || !end) {
      alert("Wpisz miejsca startowe i docelowe!");
      return;
    }

    calculateDistance(start, end, function(distanceKm) {
      if (!distanceKm) {
        alert("Nie udało się obliczyć odległości. Sprawdź nazwy miejscowości.");
        return;
      }

      console.log("Odległość:", distanceKm, "km");
      
      // 👇 Tutaj wstaw swoje obliczenia kosztu paliwa
      const spalanieNa100km = 8; // Przykładowe spalanie (l/100km)
      const cenaPaliwa = 6.50;   // Przykładowa cena (PLN/l)
      const koszt = (distanceKm / 100) * spalanieNa100km * cenaPaliwa;

      // Wyświetl wynik (dostosuj do swojego HTML)
      document.getElementById("wynik").innerHTML = `
        <strong>Trasa:</strong> ${start} → ${end}<br>
        <strong>Odległość:</strong> ${distanceKm.toFixed(1)} km<br>
        <strong>Koszt paliwa:</strong> ${koszt.toFixed(2)} PLN
      `;
    });
  });
});
