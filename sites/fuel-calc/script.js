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
    // Example calculation (replace with real distance calculation)
    const distance = 250; // km
    const consumption = parseFloat(document.getElementById('fuel-consumption').value);
    const price = parseFloat(document.getElementById('fuel-price').value);
    const passengers = parseInt(document.querySelector('.passenger-option.active').dataset.passengers);
    
    const fuelNeeded = (distance * consumption) / 100;
    const totalCost = fuelNeeded * price;
    
    document.getElementById('distance').textContent = distance + ' km';
    document.getElementById('fuel-needed').textContent = fuelNeeded.toFixed(1) + ' L';
    document.getElementById('total-cost').textContent = totalCost.toFixed(2) + ' PLN';
});
