// Custom cursor implementation
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorF = document.querySelector('.cursor-f');
    
    if (!cursor || !cursorF) return;
    
    const settings = {
        size: 8,
        sizeF: 36,
        followSpeed: 0.16
    };
    
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorF.style.display = 'none';
        return;
    }
    
    cursor.style.setProperty('--size', settings.size + 'px');
    cursorF.style.setProperty('--size', settings.sizeF + 'px');
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - settings.size/2 + 'px';
        cursor.style.top = mouseY - settings.size/2 + 'px';
    }, { passive: true });
    
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'scale(4.5)';
        cursorF.style.transform = 'scale(0.4)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'scale(1)';
        cursorF.style.transform = 'scale(1)';
    });
    
    function animate() {
        posX += (mouseX - posX) * settings.followSpeed;
        posY += (mouseY - posY) * settings.followSpeed;
        cursorF.style.left = posX - settings.sizeF/2 + 'px';
        cursorF.style.top = posY - settings.sizeF/2 + 'px';
        requestAnimationFrame(animate);
    }
    animate();
    

