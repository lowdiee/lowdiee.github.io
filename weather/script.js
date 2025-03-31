// Custom cursor implementation
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
        cursor.style.transform = 'scale(4.5)';
        cursorF.style.transform = 'scale(0.4)';
    });
    
    document.addEventListener('mouseup', function() {
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
    
    // Fetch weather data from IMGW API
    fetchWeatherData();
});

// Function to fetch weather data (mock for now)
function fetchWeatherData() {
    // In a real implementation, you would fetch from IMGW API here
    console.log("Fetching weather data...");
    
    // Mock data update
    setTimeout(() => {
        // Update the UI with new data
        document.querySelectorAll('.weather-panel').forEach(panel => {
            const timeElement = panel.querySelector('.text-sm');
            if (timeElement) {
                const now = new Date();
                timeElement.textContent = `Updated: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            }
        });
    }, 1000);
    
    // Schedule next update in 1 hour
    setTimeout(fetchWeatherData, 3600000);
}
