document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja cząstek particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4facfe"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4facfe",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });

    // Efekt pisania tekstu "PROJECTS"
    const typingText = document.getElementById('typingText');
    const words = ["PROJECTS", "プロジェクト", "المشاريع", "프로젝트", "ПРОЕКТЫ"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    
    typingText.textContent = currentChar;
    
    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 50);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, 1000);
    }
}

// Rozpocznij efekt pisania
type();

    // Efekt parallax dla tekstu
    const heroSection = document.querySelector('.hero');
    const projectsTitle = document.getElementById('typingText');
    const particlesContainer = document.getElementById('particles-js');

    function handleScroll() {
        const scrollPosition = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollPosition < heroHeight) {
            projectsTitle.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            particlesContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    }

    function resetTransforms() {
        if (window.pageYOffset === 0) {
            projectsTitle.style.transform = 'translateY(0)';
            particlesContainer.style.transform = 'translateY(0)';
        }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', resetTransforms);

    // Funkcjonalność wyświetlania czasu
    const timeDisplay = document.getElementById('timeDisplay');
    
    function updateTime() {
        const now = new Date();
        
        const cetOptions = {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const cetTime = now.toLocaleTimeString('en-GB', cetOptions);
        
        const gmtOptions = {
            timeZone: 'GMT',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const gmtTime = now.toLocaleTimeString('en-GB', gmtOptions);
        
        timeDisplay.textContent = `CET ${cetTime}`;
        timeDisplay.dataset.cet = `CET ${cetTime}`;
        timeDisplay.dataset.gmt = `GMT ${gmtTime}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    timeDisplay.addEventListener('mouseenter', () => {
        timeDisplay.textContent = timeDisplay.dataset.gmt;
    });
    
    timeDisplay.addEventListener('mouseleave', () => {
        timeDisplay.textContent = timeDisplay.dataset.cet;
    });

    // Funkcjonalność modalu "About Me"
    const aboutLink = document.querySelector('.about-link');
    const aboutModal = document.getElementById('aboutModal');
    const closeModal = document.getElementById('closeModal');
    const resumeButton = document.getElementById('resumeButton');
    
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        aboutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    resumeButton.addEventListener('click', () => {
        aboutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Animacja pojawiania się sekcji projects
    const projectsSection = document.getElementById('projects');
    
    function checkScroll() {
        const sectionTop = projectsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            projectsSection.style.transform = 'translateY(0)';
            projectsSection.style.opacity = '1';
            window.removeEventListener('scroll', checkScroll);
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
});
