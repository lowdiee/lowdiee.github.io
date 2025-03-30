
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

// Custom cursor effect (optional)
document.addEventListener('mousemove', (e) => {
    // You can add custom cursor effects here if needed
    // Currently using CSS cursor property
});
