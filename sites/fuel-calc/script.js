// Custom cursor functionality
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
    
    // Mouse move event
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update immediate cursor position
        cursor.style.left = mouseX - settings.size/2 + 'px';
        cursor.style.top = mouseY - settings.size/2 + 'px';
    }, { passive: true });
    
    // Click animations
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
        
        // Apply to follower
        cursorF.style.left = posX - settings.sizeF/2 + 'px';
        cursorF.style.top = posY - settings.sizeF/2 + 'px';
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
});

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

timeDisplay.addEventListener('mouseenter', () => {
    isHovering = true;
    setupTimeDisplay();
});

timeDisplay.addEventListener('mouseleave', () => {
    isHovering = false;
    setupTimeDisplay();
});

// Initialize time display
setupTimeDisplay();

// People selector functionality
const peopleIcons = document.querySelectorAll('.person-icon');
let selectedPeople = 1;

peopleIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        peopleIcons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        selectedPeople = parseInt(icon.getAttribute('data-people'));
    });
});

// Select first person by default
peopleIcons[0].classList.add('selected');

// Calculator functionality
document.getElementById('calculateBtn').addEventListener('click', () => {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const consumption = parseFloat(document.getElementById('consumption').value);
    const price = parseFloat(document.getElementById('price').value);

    if (!origin || !destination || isNaN(consumption) {
        alert('Please fill all required fields!');
        return;
    }

    // For now using mock distance - will be replaced with Google Maps API
    const distance = getMockDistance(origin, destination);
    const fuelNeeded = (distance * consumption) / 100;
    const totalCost = fuelNeeded * price;

    document.getElementById('distanceResult').textContent = distance.toFixed(1);
    document.getElementById('fuelNeeded').textContent = fuelNeeded.toFixed(2);
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);

    // Show results with animation
    document.getElementById('results').style.display = 'block';
    
    // Reset animations
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach(item => {
        item.style.animation = 'none';
        void item.offsetWidth; // Trigger reflow
        item.style.animation = '';
    });
});

// Mock distance function - replace with Google Maps API later
function getMockDistance(origin, destination) {
    // This will be replaced with actual API call
    return Math.random() * 300 + 50; // Random distance between 50-350km
}

// Handle Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('calculateBtn').click();
    }
});

// Show container with animation
window.addEventListener('load', () => {
    document.getElementById('fuelCalc').classList.add('visible');
});

// About modal functionality (if needed)
const aboutLink = document.querySelector('.about-link');
const aboutModal = document.getElementById('aboutModal');

if (aboutLink && aboutModal) {
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}
