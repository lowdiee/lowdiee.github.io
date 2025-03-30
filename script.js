
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

// Konfiguracja animacji
const ANIMATION_CONFIG = {
  wordDuration: 3000,
  dotSpeed: 0.04,
  switchSpeed: 0.15,
  dotSpacing: 15 // Nowy parametr - odstęp między kropkami
};

// Reszta zmiennych pozostaje bez zmian
let isPageVisible = true;
let currentWordIndex = 0;
const words = ["PROJECTS", "プロジェクト", "المشاريع", "프로젝트", "ПРОЕКТЫ"];

function handleVisibilityChange() {
  if (!document.hidden) {
    // Reset animacji z płynnym przejściem
    S.Shape.switchShape(S.ShapeBuilder.letter(words[currentWordIndex]), false);
    setTimeout(() => {
      isPageVisible = true;
    }, 100);
  } else {
    isPageVisible = false;
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange, false);

// Shape Shifter implementation
var S = {
  init: function() {
    S.Drawing.init('.canvas');
    S.ShapeBuilder.init();
    
    function animateNextWord() {
      if (isPageVisible) {
        currentWordIndex = (currentWordIndex + 1) % words.length;
        S.Shape.switchShape(S.ShapeBuilder.letter(words[currentWordIndex]));
      }
      setTimeout(animateNextWord, ANIMATION_CONFIG.wordDuration);
    }
    
    // Pierwsze uruchomienie z płynną animacją
    S.Shape.switchShape(S.ShapeBuilder.letter(words[0]), false);
    setTimeout(animateNextWord, ANIMATION_CONFIG.wordDuration);

    S.Drawing.loop(function() {
      if (isPageVisible) S.Shape.render();
    });
  }
};

S.Drawing = (function() {
  var canvas,
      context,
      renderFn,
      requestFrame = window.requestAnimationFrame ||
                   window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function(callback) {
                     window.setTimeout(callback, 1000 / 60);
                   };

  return {
    init: function(el) {
      canvas = document.querySelector(el);
     context = canvas.getContext('2d', { willReadFrequently: true }); // Dodaj tę opcję
      this.adjustCanvas();

      window.addEventListener('resize', function() {
        S.Drawing.adjustCanvas();
      });
    },

    loop: function(fn) {
      renderFn = !renderFn ? fn : renderFn;
      this.clearFrame();
      if (isPageVisible) {
        renderFn();
      }
      requestFrame.call(window, this.loop.bind(this));
    },

    adjustCanvas: function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },

    clearFrame: function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    getArea: function() {
      return { w: canvas.width, h: canvas.height };
    },

    drawCircle: function(p, c) {
      context.fillStyle = c.render();
      context.beginPath();
      context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
    }
  };
}());

S.Point = function(args) {
  this.x = args.x;
  this.y = args.y;
  this.z = args.z;
  this.a = args.a;
  this.h = args.h;
};

S.Color = function(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
};

S.Color.prototype = {
  render: function() {
    return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }
};

// W S.Dot zmień prędkość kropek
S.Dot = function(x, y) {
  this.p = new S.Point({
    x: x,
    y: y,
    z: 5,
    a: 1,
    h: 0
  });

  this.e = ANIMATION_CONFIG.dotSpeed; // Użyj nowej konfiguracji
  this.s = true;
  this.c = new S.Color(255, 255, 255, this.p.a);
  this.t = this.clone();
  this.q = [];
};

S.Dot.prototype = {
  clone: function() {
    return new S.Point({
      x: this.p.x,
      y: this.p.y,
      z: this.p.z,
      a: this.p.a,
      h: this.p.h
    });
  },

  _draw: function() {
    this.c.a = this.p.a;
    S.Drawing.drawCircle(this.p, this.c);
  },

  _moveTowards: function(n) {
    var details = this.distanceTo(n, true),
        dx = details[0],
        dy = details[1],
        d = details[2],
        e = this.e * d;

    if (this.p.h === -1) {
      this.p.x = n.x;
      this.p.y = n.y;
      return true;
    }

    if (d > 1) {
      this.p.x -= ((dx / d) * e);
      this.p.y -= ((dy / d) * e);
    } else {
      if (this.p.h > 0) {
        this.p.h--;
      } else {
        return true;
      }
    }

    return false;
  },

  _update: function() {
    if (this._moveTowards(this.t)) {
      var p = this.q.shift();
      if (p) {
        this.t.x = p.x || this.p.x;
        this.t.y = p.y || this.p.y;
        this.t.z = p.z || this.p.z;
        this.t.a = p.a || this.p.a;
        this.p.h = p.h || 0;
      }
    }

    var d = this.p.a - this.t.a;
    this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
    d = this.p.z - this.t.z;
    this.p.z = Math.max(1, this.p.z - (d * 0.05));
  },

  distanceTo: function(n, details) {
    var dx = this.p.x - n.x,
        dy = this.p.y - n.y,
        d = Math.sqrt(dx * dx + dy * dy);

    return details ? [dx, dy, d] : d;
  },

  move: function(p, avoidStatic) {
    if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
      this.q.push(p);
    }
  },

  render: function() {
    this._update();
    this._draw();
  }
};

S.ShapeBuilder = (function() {
  var gap = 15,
      shapeCanvas = document.createElement('canvas'),
      shapeContext = shapeCanvas.getContext('2d'),
      fontSize = 500,
      fontFamily = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

  function fit() {
    shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
    shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
    shapeContext.fillStyle = 'red';
    shapeContext.textBaseline = 'middle';
    shapeContext.textAlign = 'center';
  }

  function processCanvas() {
    var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data,
        dots = [],
        x = 0,
        y = 0,
        fx = shapeCanvas.width,
        fy = shapeCanvas.height,
        w = 0,
        h = 0;

    // Generuj kropki na regularnej siatce
    for (y = 0; y < shapeCanvas.height; y += gap) {
      for (x = 0; x < shapeCanvas.width; x += gap) {
        // Sprawdź czy w tym miejscu jest tekst
        var p = (Math.floor(y) * shapeCanvas.width + Math.floor(x)) * 4;
        if (pixels[p + 3] > 0) { // Tylko jeśli jest część tekstu
          dots.push(new S.Point({
            x: x,
            y: y
          }));
        }
        
        // Aktualizuj rozmiary obszaru
        w = x > w ? x : w;
        h = y > h ? y : h;
        fx = x < fx ? x : fx;
        fy = y < fy ? y : fy;
      }
    }

    return { dots: dots, w: w + fx, h: h + fy };
  }

  function setFontSize(s) {
    shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
  }

  function init() {
    fit();
    window.addEventListener('resize', fit);
  }

  return {
    init: init,
    
    letter: function(l) {
      var s = 0;
      setFontSize(fontSize);
      s = Math.min(fontSize,
                  (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * fontSize,
                  (shapeCanvas.height / fontSize) * 0.8 * fontSize);
      setFontSize(s);

      shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
      shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);

      return processCanvas();
    }
  };
}());

S.Shape = (function() {
  var dots = [],
      width = 0,
      height = 0,
      cx = 0,
      cy = 0;

  function compensate() {
    var a = S.Drawing.getArea();
    cx = a.w / 2 - width / 2;
    cy = a.h / 2 - height / 2;
  }

  return {
    shuffleIdle: function() {
      // Wyłączone losowe poruszanie kropek
    },

    switchShape: function(n, fast) {
      var size, a = S.Drawing.getArea();
      width = n.w;
      height = n.h;
      compensate();

      // Zachowaj tylko kropki potrzebne dla nowego kształtu
      if (n.dots.length < dots.length) {
        dots = dots.slice(0, n.dots.length);
      } else if (n.dots.length > dots.length) {
        size = n.dots.length - dots.length;
        for (var d = 1; d <= size; d++) {
          dots.push(new S.Dot(a.w / 2, a.h / 2));
        }
      }

      var d = 0, i = 0;
      while (n.dots.length > 0) {
        i = Math.floor(Math.random() * n.dots.length);
        dots[d].e = fast ? 0.25 : 0.11;

        dots[d].s = true;
        dots[d].move(new S.Point({
          x: n.dots[i].x + cx,
          y: n.dots[i].y + cy,
          a: 1,
          z: 5,
          h: 0
        }));

        n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
        d++;
      }
    },

    render: function() {
      for (var d = 0; d < dots.length; d++) {
        dots[d].render();
      }
    }
  };
}());

// Initialize when fonts are loaded
WebFont.load({
  custom: {
    families: ['SF Pro Display'],
    urls: ['https://fonts.cdnfonts.com/css/sf-pro-display']
  },
  active: function() {
    S.init();
  },
  inactive: function() {
    // Fallback if fonts fail to load
    setTimeout(S.init, 1000);
  }
});

// Animacja projektów
function animateProjects() {
    const projectItems = document.querySelectorAll('.project-item');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.8;

    projectItems.forEach((item, index) => {
        const itemTop = item.getBoundingClientRect().top;
        
        if (itemTop < triggerPoint) {
            item.classList.add('animate');
        }
    });
}

// Obsługa scrollowania
window.addEventListener('scroll', animateProjects);
window.addEventListener('load', animateProjects); // Animacja przy pierwszym ładowaniu
