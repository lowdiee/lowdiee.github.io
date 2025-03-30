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
    cursorF.style.top = posY - settings.sizeF/2 + 'px'; // Usunięto scrollY
    
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

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator');

function handleScroll() {
  if (window.pageYOffset > 50) {
    scrollIndicator.classList.add('hidden');
  } else {
    scrollIndicator.classList.remove('hidden');
  }
}

// Initial check
handleScroll();

// Add scroll event listener
window.addEventListener('scroll', handleScroll);
// Initial check
handleScroll();

// Add scroll event listener
window.addEventListener('scroll', handleScroll);


// Fuel Calculator
document.addEventListener('DOMContentLoaded', function() {
    const minusBtn = document.querySelector('.passenger-btn.minus');
    const plusBtn = document.querySelector('.passenger-btn.plus');
    const passengerCount = document.querySelector('.passenger-count .count');
    const calculateBtn = document.getElementById('calculate-btn');
    
    let passengers = 1;
    
    // Passenger count controls
    minusBtn.addEventListener('click', function() {
        if (passengers > 1) {
            passengers--;
            passengerCount.textContent = passengers;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        if (passengers < 8) {
            passengers++;
            passengerCount.textContent = passengers;
        }
    });
    
    // Calculate button
    calculateBtn.addEventListener('click', function() {
        // For now we'll use a fixed distance since we don't have Google Maps API integrated yet
        const distance = 300; // km - to be replaced with actual distance calculation
        const consumption = parseFloat(document.getElementById('fuel-consumption').value);
        const fuelPrice = parseFloat(document.getElementById('fuel-price').value);
        
        // Calculations
        const fuelNeeded = (distance * consumption) / 100;
        const totalCost = fuelNeeded * fuelPrice;
        const costPerPerson = totalCost / passengers;
        
        // Display results
        document.getElementById('distance').textContent = distance + ' km';
        document.getElementById('fuel-needed').textContent = fuelNeeded.toFixed(1) + ' l';
        document.getElementById('total-cost').textContent = totalCost.toFixed(2) + ' zł';
        document.getElementById('cost-per-person').textContent = costPerPerson.toFixed(2) + ' zł';
        
        // Show results
        document.getElementById('results').style.display = 'block';
    });
    
    // Initialize with empty results
    document.getElementById('results').style.display = 'none';
});


// Passenger Selection
let passengers = 1;
document.querySelectorAll('.passenger-option').forEach((option, index) => {
    option.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.passenger-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Update passengers count
        passengers = parseInt(this.dataset.passengers);
    });
    
    // Set first option as active by default
    if (index === 0) option.classList.add('active');
});

// Calculate button
document.getElementById('calculate-btn').addEventListener('click', function() {
    const distance = 300; // km - to be replaced with API calculation
    const consumption = parseFloat(document.getElementById('fuel-consumption').value);
    const fuelPrice = parseFloat(document.getElementById('fuel-price').value);
    
    // Calculations
    const fuelNeeded = (distance * consumption) / 100;
    const totalCost = fuelNeeded * fuelPrice;
    const costPerPerson = totalCost / passengers;
    
    // Display results
    document.getElementById('distance').textContent = distance.toFixed(0) + ' km';
    document.getElementById('fuel-needed').textContent = fuelNeeded.toFixed(1) + ' l';
    document.getElementById('total-cost').textContent = totalCost.toFixed(2) + ' PLN';
    document.getElementById('cost-per-person').textContent = costPerPerson.toFixed(2) + ' PLN';
    
    // Show results with animation
    const results = document.getElementById('results');
    results.style.display = 'block';
    setTimeout(() => {
        results.style.opacity = '1';
        results.style.transform = 'translateY(0)';
    }, 10);
});

// Passenger selection
document.querySelectorAll('.passenger-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.passenger-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Calculate function
document.querySelector('.calculate-btn').addEventListener('click', function() {
    // Example calculation (replace with real logic)
    const distance = 250; // km
    const consumption = parseFloat(document.getElementById('fuel-consumption').value);
    const price = parseFloat(document.getElementById('fuel-price').value);
    const passengers = document.querySelector('.passenger-option.active').dataset.value;
    
    const fuelNeeded = (distance * consumption) / 100;
    const totalCost = fuelNeeded * price;
    
    // Display results
    document.getElementById('distance-result').textContent = distance + ' km';
    document.getElementById('fuel-result').textContent = fuelNeeded.toFixed(1) + ' L';
    document.getElementById('cost-result').textContent = totalCost.toFixed(2) + ' PLN';
});
