// Modern animated background effect
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

// Configuration
const config = {
    particleCount: 20,  // Reduced particle count
    baseHue: 210,  // Blue base
    hueRange: 60,  // Hue variation
    lineWidth: 0.3,
    connectDistance: 100,  // Reduced connection distance
    speed: 0.2,  // Reduced speed
    size: 2,
    blur: 4  // Reduced blur
};

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.hue = config.baseHue + Math.random() * config.hueRange;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, config.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 70%, 50%)`;
        ctx.fill();
    }
}

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update blur effect
    ctx.filter = `blur(${config.blur}px)`;
}

// Create particles
const particles = Array(config.particleCount).fill().map(() => new Particle());

// Animation loop
function animate() {
    // Clear with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(23, 36, 64, 0.8)');  // Dark blue
    gradient.addColorStop(1, 'rgba(29, 53, 87, 0.8)');  // Lighter blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections (optimized)
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = dx * dx + dy * dy; // Removed square root for performance

            if (distance < config.connectDistance * config.connectDistance) {
                const alpha = 1 - (Math.sqrt(distance) / config.connectDistance);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`; // Simplified color
                ctx.lineWidth = config.lineWidth;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Initialize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('DOMContentLoaded', resizeCanvas);
animate();

animate();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}