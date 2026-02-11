/**
 * HELIXONE - REVOLUTIONARY TRADING INTERFACE
 * Advanced JavaScript for cutting-edge web experiences
 */

// Variables globales
let scene, camera, renderer, portalTunnel, particleSystem;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let isTransitioning = false;
let animationId = null;
let lenis = null;

// Performance monitoring
let fps = 0;
let lastTime = 0;
let frameCount = 0;

// State management
const AppState = {
  isLoading: true,
  isPortalVisible: true,
  isMainVisible: false,
  currentSection: 'home',
  animationsEnabled: true
};

// Easing functions
const Easing = {
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeOutElastic: function(t) {
    return Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -10 * t) + 1;
  },
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  easeOutBounce: function(t) {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};

// Random number generator
const FastRandom = {
  seed: 12345,
  next: function() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  },
  range: function(min, max) {
    return min + this.next() * (max - min);
  }
};

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const args = arguments;
    const later = function() {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() { inThrottle = false; }, limit);
    }
  };
}

// Custom Cursor System
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    if (!this.cursor) return;

    this.cursorDot = this.cursor.querySelector('.cursor-dot');
    this.cursorRing = this.cursor.querySelector('.cursor-ring');

    this.mouse = { x: 0, y: 0 };
    this.cursorPos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };

    this.speed = 0.15;
    this.ringSpeed = 0.08;

    this.init();
  }

  init() {
    if (window.innerWidth <= 768) {
      this.cursor.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.update();
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onMouseDown() {
    this.cursor.classList.add('active');
    if (typeof gsap !== 'undefined') {
      gsap.to(this.cursorRing, {
        scale: 0.8,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }

  onMouseUp() {
    this.cursor.classList.remove('active');
    if (typeof gsap !== 'undefined') {
      gsap.to(this.cursorRing, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  update() {
    this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * this.speed;
    this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * this.speed;

    this.ringPos.x += (this.mouse.x - this.ringPos.x) * this.ringSpeed;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * this.ringSpeed;

    if (this.cursorDot && this.cursorRing) {
      this.cursorDot.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
      this.cursorRing.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px)`;
    }

    requestAnimationFrame(this.update.bind(this));
  }
}

// Loading Manager
class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.loadingBar = document.querySelector('.loading-bar');
    this.loadingStatus = document.querySelector('.loading-status');

    this.progress = 0;
    this.targetProgress = 0;
    this.isComplete = false;

    this.messages = [
      'Initializing quantum matrices...',
      'Calibrating neural networks...',
      'Synchronizing market data...',
      'Activating AI algorithms...',
      'Establishing secure connections...',
      'Loading trading interface...',
      'Finalizing system setup...'
    ];

    this.currentMessageIndex = 0;
  }

  start() {
    this.updateMessage();
    this.simulateLoading();
  }

  simulateLoading() {
    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.setProgress(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => this.complete(), 500);
      }
    };

    animate();
  }

  setProgress(value) {
    this.targetProgress = value;
    this.updateProgress();

    const messageIndex = Math.floor((value / 100) * this.messages.length);
    if (messageIndex !== this.currentMessageIndex && messageIndex < this.messages.length) {
      this.currentMessageIndex = messageIndex;
      this.updateMessage();
    }
  }

  updateProgress() {
    this.progress += (this.targetProgress - this.progress) * 0.1;
    if (this.loadingBar) {
      this.loadingBar.style.width = `${this.progress}%`;
    }

    if (Math.abs(this.targetProgress - this.progress) > 0.1) {
      requestAnimationFrame(() => this.updateProgress());
    }
  }

  updateMessage() {
    if (this.currentMessageIndex < this.messages.length && this.loadingStatus) {
      this.loadingStatus.textContent = this.messages[this.currentMessageIndex];
    }
  }

  complete() {
    this.isComplete = true;
    AppState.isLoading = false;

    if (typeof gsap !== 'undefined' && this.loadingScreen) {
      gsap.to(this.loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          this.loadingScreen.classList.add('hidden');
          this.loadingScreen.style.display = 'none';
        }
      });
    } else if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        this.loadingScreen.classList.add('hidden');
        this.loadingScreen.style.display = 'none';
      }, 1000);
    }
  }
}

// Portal System
class PortalSystem {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;

    this.portalElements = {
      rings: [],
      particles: null,
      energy: null
    };

    this.transitionState = {
      isActive: false,
      progress: 0,
      duration: 5000
    };
  }

  init() {
    if (!this.canvas || window.innerWidth <= 768 || typeof THREE === 'undefined') return;

    this.clock = new THREE.Clock();
    this.setupRenderer();
    this.createScene();
    this.createPortalElements();
    this.addEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000011, 0);

    this.camera.position.z = 5;
  }

  createScene() {
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.1);
    this.scene.add(ambientLight);

    this.createAmbientParticles();
    this.createFloatingShapes();
  }

  createAmbientParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 2000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );

      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.3);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  createFloatingShapes() {
    this.floatingShapes = [];

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.OctahedronGeometry(0.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      shape.userData = {
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        floatSpeed: Math.random() * 0.01 + 0.005,
        floatOffset: Math.random() * Math.PI * 2
      };

      this.floatingShapes.push(shape);
      this.scene.add(shape);
    }
  }

  createPortalElements() {
    // éléments de fond initialement
  }

  createPortalTunnel() {
    // Clear existing objects
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.portalElements.rings = [];

    // Create tunnel rings
    for (let i = 0; i < 50; i++) {
      const innerRadius = 1 + i * 0.1;
      const outerRadius = innerRadius + 0.5 + i * 0.02;

      const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.005, 1, 0.6),
        transparent: true,
        opacity: 0.8 - (i * 0.015),
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.position.z = -i * 4;
      ring.rotation.z = i * 0.1;

      this.portalElements.rings.push(ring);
      this.scene.add(ring);
    }

    this.createSpiralParticles();
  }

  createSpiralParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 5000; i++) {
      const t = i / 5000;
      const angle = t * Math.PI * 40;
      const radius = 0.5 + t * 12;

      vertices.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        -t * 150
      );

      const color = new THREE.Color();
      color.setHSL(0.45 + t * 0.3, 1, 0.5 + Math.sin(t * 10) * 0.3);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.portalElements.particles = new THREE.Points(geometry, material);
    this.scene.add(this.portalElements.particles);
  }

  startTransition() {
    if (this.transitionState.isActive) return;

    this.transitionState.isActive = true;
    this.transitionState.progress = 0;

    this.createPortalTunnel();
    this.createScreenEffects();
    this.animateTransition();
  }

  createScreenEffects() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, rgba(0,212,255,0.9) 0%, transparent 70%);
      z-index: 9998;
      opacity: 0;
      pointer-events: none;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(flash);

    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to(flash, { opacity: 1, duration: 0.1 })
        .to(flash, { opacity: 0, duration: 0.2 })
        .to(flash, { opacity: 0.7, duration: 0.15, delay: 0.5 })
        .to(flash, { opacity: 0, duration: 0.3 })
        .call(() => {
          if (flash.parentNode) document.body.removeChild(flash);
        }, null, 2);
    } else {
      flash.style.opacity = '1';
      setTimeout(() => flash.style.opacity = '0', 100);
      setTimeout(() => {
        if (flash.parentNode) document.body.removeChild(flash);
      }, 2000);
    }
  }

  animateTransition() {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      this.transitionState.progress = Math.min(elapsed / this.transitionState.duration, 1);

      const easeProgress = Easing.easeInOutCubic(this.transitionState.progress);

      // Animate tunnel rings
      this.portalElements.rings.forEach((ring, index) => {
        const speed = 0.5 + easeProgress * 20;
        ring.position.z += speed;
        ring.rotation.z += 0.02 * speed;

        const pulse = Math.sin(Date.now() * 0.01 + index * 0.3) * 0.3 + 1;
        ring.scale.setScalar(pulse * (1 + easeProgress * 0.5));

        if (ring.position.z > 15) {
          ring.position.z = -200;
        }
      });

      // Animate spiral particles
      if (this.portalElements.particles) {
        this.portalElements.particles.rotation.z += 0.01 * (1 + easeProgress * 3);

        const positions = this.portalElements.particles.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += (1 + easeProgress * 2) * 0.8;
          if (positions[i] > 20) {
            positions[i] = -150;
          }
        }
        this.portalElements.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Camera effects
      this.camera.position.z = 5 - easeProgress * 15;
      this.camera.fov = 75 + easeProgress * 70;
      this.camera.updateProjectionMatrix();
      this.camera.rotation.z = easeProgress * Math.PI * 3;

      // Screen distortions
      const intensity = easeProgress;
      this.canvas.style.transform = `
        scale(${1 + intensity * 0.2}) 
        rotate(${intensity * 10}deg)
      `;
      this.canvas.style.filter = `
        hue-rotate(${intensity * 360}deg) 
        saturate(${1 + intensity * 2}) 
        brightness(${1 + intensity * 0.3})
        blur(${intensity * 2}px)
      `;

      document.body.style.transform = `
        perspective(1000px) 
        rotateX(${intensity * 15}deg) 
        rotateY(${intensity * 5}deg)
      `;

      if (this.transitionState.progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.completeTransition();
      }
    };

    animate();
  }

  completeTransition() {
    const exitFlash = document.createElement('div');
    exitFlash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(0,212,255,0.3) 70%, transparent 100%);
      z-index: 9999;
      opacity: 1;
      pointer-events: none;
    `;
    document.body.appendChild(exitFlash);

    if (typeof gsap !== 'undefined') {
      gsap.to(exitFlash, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          if (exitFlash.parentNode) document.body.removeChild(exitFlash);
        }
      });
    } else {
      setTimeout(() => {
        exitFlash.style.opacity = '0';
        setTimeout(() => {
          if (exitFlash.parentNode) document.body.removeChild(exitFlash);
        }, 1000);
      }, 100);
    }

    setTimeout(() => {
      document.body.style.transform = 'none';
      this.canvas.style.transform = 'none';
      this.canvas.style.filter = 'none';

      const portalScreen = document.getElementById('portalScreen');
      const mainApp = document.getElementById('mainApp');

      if (portalScreen) portalScreen.style.display = 'none';
      if (mainApp) {
        mainApp.classList.add('visible');
        AppState.isPortalVisible = false;
        AppState.isMainVisible = true;
      }

      this.resetForBackground();
    }, 500);
  }

  resetForBackground() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.createAmbientParticles();
    this.createFloatingShapes();

    this.camera.position.set(0, 0, 5);
    this.camera.rotation.set(0, 0, 0);
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    this.canvas.style.position = 'fixed';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.6';

    this.transitionState.isActive = false;
  }

  animate() {
    if (!this.renderer) return;

    animationId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

    if (!this.transitionState.isActive) {
      if (this.ambientParticles) {
        this.ambientParticles.rotation.y += 0.001;
      }

      if (this.floatingShapes) {
        this.floatingShapes.forEach((shape) => {
          shape.rotation.x += shape.userData.rotationSpeed.x;
          shape.rotation.y += shape.userData.rotationSpeed.y;
          shape.rotation.z += shape.userData.rotationSpeed.z;

          shape.position.y += Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.01;
        });
      }

      targetMouseX = (mouseX / window.innerWidth) * 2 - 1;
      targetMouseY = -(mouseY / window.innerHeight) * 2 + 1;

      this.camera.position.x += (targetMouseX * 0.1 - this.camera.position.x) * 0.05;
      this.camera.position.y += (targetMouseY * 0.1 - this.camera.position.y) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
    this.updateFPS();
  }

  updateFPS() {
    const now = performance.now();
    frameCount++;

    if (now >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;

      if (fps < 30 && this.renderer.getPixelRatio() > 1) {
        this.renderer.setPixelRatio(1);
      }
    }
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!document.hidden) {
        this.animate();
      }
    }, { passive: true });
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}

// Statistics Counter
class StatCounters {
  constructor() {
    this.counters = document.querySelectorAll('[data-target]');
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => {
      this.observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = Easing.easeOutElastic(progress);
      const currentValue = target * easeProgress;

      if (target % 1 === 0) {
        element.textContent = Math.floor(currentValue);
      } else {
        element.textContent = currentValue.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(animate);
  }
}

// Main Application
class HelixOneApp {
  constructor() {
    this.components = {};
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      this.components.loadingManager = new LoadingManager();
      this.components.loadingManager.start();

      await this.waitForLoading();

      this.components.cursor = new CustomCursor();
      this.components.portalSystem = new PortalSystem();
      this.components.statCounters = new StatCounters();

      this.initLenis();
      this.components.portalSystem.init();
      this.setupPortalButton();
      this.setupFormHandlers();
      this.bindGlobalShortcuts();

      this.isInitialized = true;
      console.log('HelixOne application initialized successfully');

    } catch (error) {
      console.error('Failed to initialize HelixOne application:', error);
      this.handleInitializationError(error);
    }
  }

  async waitForLoading() {
    return new Promise(resolve => {
      const checkLoading = () => {
        if (this.components.loadingManager.isComplete) {
          resolve();
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  initLenis() {
    try {
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ smooth: true, lerp: 0.08 });
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    } catch (e) {
      // Silent fallback
    }
  }

  setupPortalButton() {
    const portalButton = document.getElementById('portalButton');
    if (!portalButton) return;

    portalButton.addEventListener('click', () => {
      if (!this.components.portalSystem.transitionState.isActive) {
        this.startPortalTransition();
      }
    });
  }

  startPortalTransition() {
    const portalScreen = document.getElementById('portalScreen');
    if (typeof gsap !== 'undefined' && portalScreen) {
      gsap.to(portalScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      });
    } else if (portalScreen) {
      portalScreen.style.opacity = '0';
    }

    this.components.portalSystem.startTransition();
  }

  setupFormHandlers() {
    const accessForm = document.getElementById('accessForm');
    if (!accessForm) return;

    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = accessForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';

      if (email) {
        this.handleFormSubmission(email);
      }
    });
  }

  handleFormSubmission(email) {
    const submitButton = document.querySelector('.access-submit');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.classList.add('is-loading');
    submitButton.textContent = 'Connecting…';

    // simple validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      this.showToast('Veuillez saisir un email valide.', 'error');
      submitButton.disabled = false;
      submitButton.classList.remove('is-loading');
      submitButton.textContent = originalText;
      return;
    }

    const payload = {
      email,
      ts: Date.now(),
      ua: navigator.userAgent
    };

    const onSuccess = () => {
      try {
        localStorage.setItem('helixone_early_access_email', email);
      } catch (_) {}

      submitButton.classList.remove('is-loading');
      submitButton.textContent = 'Welcome!';
      this.showToast('Accès validé. Préparation de l’interface…', 'success');

      // Lancer la transition du portail
      setTimeout(() => {
        this.startPortalTransition();
        // rétablir le bouton plus tard
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 1500);
      }, 400);
    };

    const onError = (msg = 'Impossible de contacter le serveur. Passage en mode hors-ligne.') => {
      console.warn(msg);
      this.showToast(msg, 'warning');
      // On valide quand même l’expérience
      onSuccess();
    };

    // Tentative de POST vers une route API si elle existe
    try {
      if (window.fetch) {
        fetch('/api/early-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
          keepalive: true
        })
        .then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json().catch(() => ({}));
        })
        .then(() => onSuccess())
        .catch(() => onError());
      } else {
        // Fallback sans fetch
        setTimeout(onSuccess, 600);
      }
    } catch (e) {
      onError();
    }
  }

  bindGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Skip animations
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!AppState.isMainVisible) {
          this.startPortalTransition();
        }
      }
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 16px',
      background: type === 'success' ? '#00C853' :
                  type === 'error'   ? '#D32F2F' :
                  type === 'warning' ? '#FFA000' : '#1976D2',
      color: '#fff',
      borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      zIndex: 10000,
      opacity: '0',
      transform: 'translateY(8px)',
      transition: 'all .25s ease'
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  handleInitializationError(error) {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
      background: #0b0f14; color:#fff; z-index: 10001; padding: 24px; text-align:center;
    `;
    msg.innerHTML = `
      <div style="max-width:560px">
        <h2 style="margin:0 0 12px 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
          ⚠️ Unexpected error
        </h2>
        <p style="opacity:.8; line-height:1.5">
          An error occurred while initializing HelixOne.<br/>
          Try refreshing the page or check your console for details.
        </p>
      </div>
    `;
    document.body.appendChild(msg);
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.HelixOne = new HelixOneApp();
  window.HelixOne.init();
});
