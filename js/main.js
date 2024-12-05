// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Portfolio filtering for both sections
function initializePortfolioSection(sectionClass) {
    const filterButtons = document.querySelectorAll(`.${sectionClass} .filter-btn`);
    const portfolioItems = document.querySelectorAll(`.${sectionClass} .portfolio-item`);
    const portfolioGrid = document.querySelector(`.${sectionClass} .portfolio-grid`);

    // Initialize 'all' button as active
    document.addEventListener('DOMContentLoaded', () => {
        const allButton = document.querySelector(`.${sectionClass} .filter-btn[data-filter="all"]`);
        if (allButton) {
            allButton.classList.add('active');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active state from all buttons in this section
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active state to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            
            portfolioGrid.classList.add('filtering');
            
            setTimeout(() => {
                portfolioItems.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        item.style.display = '';
                        item.classList.remove('hidden');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }
                });
                
                portfolioGrid.classList.remove('filtering');
            }, 300);
        });
    });
}

// Initialize both portfolio sections
initializePortfolioSection('main-portfolio');
initializePortfolioSection('other-portfolio');

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
let currentImageIndex = 0;
let visibleImages = [];

// Collect all images in the current filter
function updateVisibleImages() {
    const currentSection = document.querySelector('.portfolio-item').closest('section');
    const currentFilter = currentSection.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const sectionItems = currentSection.querySelectorAll('.portfolio-item');
    
    visibleImages = Array.from(sectionItems)
        .filter(item => {
            if (currentFilter === 'all') return true;
            return item.getAttribute('data-category').includes(currentFilter);
        })
        .map(item => item.querySelector('img'))
        .filter(img => img !== null);
}

// Open Lightbox
function openLightbox(index) {
    const clickedItem = event.currentTarget;
    const clickedImg = clickedItem.querySelector('img');
    const currentSection = clickedItem.closest('section');
    const sectionItems = currentSection.querySelectorAll('.portfolio-item');
    
    updateVisibleImages();
    
    // Find the index of the clicked image in the visible images
    currentImageIndex = visibleImages.findIndex(img => img.src === clickedImg.src);
    if (currentImageIndex === -1) currentImageIndex = 0;
    
    const img = visibleImages[currentImageIndex];
    if (img) {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
    }
}

// Close Lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
}

// Next image
function nextImage() {
    if (visibleImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImageIndex].src;
    }
}

// Previous image
function prevImage() {
    if (visibleImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImageIndex].src;
    }
}

// Bind events
portfolioItems.forEach((item, index) => {
    item.addEventListener('click', openLightbox);
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

// Close Lightbox when clicking on the background
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard control
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    }
});

// Initialize visible images
updateVisibleImages();

// Header scroll effect
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Header effect
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
    } else if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;

    // Hero background fade-out effect
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const fadeStart = 0;
    const fadeEnd = heroHeight / 2;
    const opacity = 1 - Math.min(1, Math.max(0, (scrolled - fadeStart) / (fadeEnd - fadeStart)));
    
    hero.style.setProperty('--scroll-opacity', opacity);
});
