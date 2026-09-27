/**
 * Golds Blue Services - Interactive Frontend Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Animated Rotating Search Placeholder
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
        const placeholders = [
            'Search "Flights Worldwide" (Delta, United)...',
            'Search "Hotels & Airbnb Stays" (Marriott, Hilton)...',
            'Search "Uber Ride & Transit Discounts"...',
            'Search "IKEA Furniture & Decor Vouchers"...',
            'Search "DoorDash & Food Delivery"...',
            'Search "Theme Parks" (Disney, Universal)...',
            'Search "AMC Movie & Concert Tickets"...',
            'Search "Car Rentals" (Hertz, Enterprise)...',
            'Search "Student Vouchers & Passes"...'
        ];
        
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            if (document.activeElement === searchInput) {
                setTimeout(typeEffect, 1000);
                return;
            }

            const current = placeholders[index];
            if (isDeleting) {
                searchInput.setAttribute('placeholder', current.substring(0, charIndex - 1));
                charIndex--;
                typingSpeed = 40;
            } else {
                searchInput.setAttribute('placeholder', current.substring(0, charIndex + 1));
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === current.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % placeholders.length;
                typingSpeed = 400;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();

        // Interactive Real-Time Search Filter
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.service-box-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 2. Hero Banner Automatic Slider (2-Card Compact Grid on Desktop, 1-Card on Mobile)
    const sliderWrapper = document.getElementById('hero-slider-wrapper');
    const sliderTrack = document.getElementById('hero-slider-track');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const paginationBullets = document.querySelectorAll('.pagination-bullet');

    if (sliderTrack) {
        const slides = sliderTrack.querySelectorAll('.hero-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;
        const autoSlideDuration = 4000; // 4s per slide
        let slideInterval = null;

        function getVisibleCards() {
            return window.innerWidth > 768 ? 2 : 1;
        }

        function updateSlide(index) {
            const visibleCards = getVisibleCards();
            const maxIndex = totalSlides > visibleCards ? totalSlides - visibleCards : 0;
            
            if (index > maxIndex) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = maxIndex;
            } else {
                currentSlide = index;
            }

            if (visibleCards === 1) {
                sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            } else {
                const firstSlide = slides[0];
                if (firstSlide) {
                    const slideWidth = firstSlide.offsetWidth;
                    const gap = 20;
                    sliderTrack.style.transform = `translateX(-${currentSlide * (slideWidth + gap)}px)`;
                }
            }

            // Update active slide class
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });

            // Update pagination bullets
            paginationBullets.forEach((bullet, i) => {
                bullet.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            const visibleCards = getVisibleCards();
            const maxIndex = totalSlides > visibleCards ? totalSlides - visibleCards : 0;
            if (currentSlide >= maxIndex) {
                updateSlide(0);
            } else {
                updateSlide(currentSlide + 1);
            }
        }

        function prevSlide() {
            const visibleCards = getVisibleCards();
            const maxIndex = totalSlides > visibleCards ? totalSlides - visibleCards : 0;
            if (currentSlide <= 0) {
                updateSlide(maxIndex);
            } else {
                updateSlide(currentSlide - 1);
            }
        }

        function startAutoSlide() {
            stopAutoSlide();
            slideInterval = setInterval(() => {
                nextSlide();
            }, autoSlideDuration);
        }

        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                startAutoSlide();
            });
        }

        // Pagination bullets
        paginationBullets.forEach((bullet) => {
            bullet.addEventListener('click', (e) => {
                e.preventDefault();
                const targetIdx = parseInt(bullet.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    updateSlide(targetIdx);
                    startAutoSlide();
                }
            });
        });

        // Pause on mouse hover & resume on leave
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
            sliderWrapper.addEventListener('mouseleave', startAutoSlide);

            // Touch swipe gesture support for mobile & tablet
            let touchStartX = 0;
            let touchEndX = 0;

            sliderWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            }, { passive: true });

            sliderWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchStartX - touchEndX;
                if (Math.abs(swipeDistance) > 40) {
                    if (swipeDistance > 0) {
                        nextSlide(); // Swiped left -> next
                    } else {
                        prevSlide(); // Swiped right -> prev
                    }
                }
                startAutoSlide();
            }, { passive: true });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            updateSlide(currentSlide);
        });

        // Start auto slider on page load
        updateSlide(0);
        startAutoSlide();
    }

    // 3. Smooth Navigation Scrolling
    document.querySelectorAll('.sub-nav-menu a, .service-action-btn, .btn-get-service').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // 4. Quick service selection from card buttons to form
    document.querySelectorAll('.service-box-card').forEach(card => {
        const btn = card.querySelector('.service-action-btn');
        const titleEl = card.querySelector('.service-box-title');
        if (btn && titleEl) {
            btn.addEventListener('click', () => {
                const select = document.getElementById('service-select');
                const note = document.getElementById('user-note');
                const title = titleEl.textContent.trim();
                
                if (select) {
                    // Match select option if possible
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].text.toLowerCase().includes(title.toLowerCase().slice(0, 8))) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }
                if (note) {
                    note.value = `Inquiry regarding: ${title}`;
                }
            });
        }
    });

    // 5. Google Sheets Lead Form Integration
    const leadForm = document.getElementById('lead-booking-form');
    const formStatus = document.getElementById('form-status-message');
    const submitBtn = document.getElementById('btn-submit-lead');

    // Google Sheets Webhook URL (Deploys via Google Apps Script)
    const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxZyEE3Fz9QW3OV07cW1Hgwov5fkcLStXBUaWkZZnG5epsijCM-sboDbRIFi29UAGe6aQ/exec';

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const service = document.getElementById('service-select')?.value || '';
            const name = document.getElementById('user-name')?.value.trim() || '';
            const contact = document.getElementById('user-email')?.value.trim() || '';
            const details = document.getElementById('user-note')?.value.trim() || '';

            if (!service || !name || !contact) {
                showFormStatus('Please fill in all required fields.', 'error');
                return;
            }

            const leadData = {
                timestamp: new Date().toISOString(),
                service: service,
                name: name,
                contact: contact,
                details: details,
                source: window.location.href
            };

            // 1. Backup Lead to LocalStorage immediately so no data is ever lost
            try {
                const storedLeads = JSON.parse(localStorage.getItem('goide_bulls_leads') || '[]');
                storedLeads.push(leadData);
                localStorage.setItem('goide_bulls_leads', JSON.stringify(storedLeads));
            } catch (err) {
                console.warn('LocalStorage save error:', err);
            }

            // 2. Set Button Loading UI State
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');
                if (btnText) btnText.style.display = 'none';
                if (btnSpinner) btnSpinner.style.display = 'inline-flex';
            }

            // 3. Send to Google Sheets Webhook (if URL configured) or simulate successful submission
            try {
                if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
                    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Google Apps Script Web App works smoothly with no-cors
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(leadData)
                    });
                } else {
                    // Small mock delay for visual feedback if Webhook URL is pending deployment
                    await new Promise(res => setTimeout(res, 800));
                }

                // 4. Save Session Data & Redirect to Thank You Page
                const randomRef = 'GB-' + Math.floor(100000 + Math.random() * 900000);
                try {
                    sessionStorage.setItem('last_lead_name', name);
                    sessionStorage.setItem('last_lead_service', service);
                    sessionStorage.setItem('last_lead_ref', randomRef);
                } catch (e) {}

                showFormStatus(
                    `<strong><i class="fa-solid fa-circle-check"></i> Request Received!</strong> Thank you, <strong>${name}</strong>! Redirecting to confirmation page...`,
                    'success'
                );

                // Redirect to Thank You Page after 1 second
                setTimeout(() => {
                    const thankYouUrl = `thank-you.html?name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}&ref=${randomRef}`;
                    window.location.href = thankYouUrl;
                }, 1000);

            } catch (error) {
                console.error('Submission error:', error);
                const randomRef = 'GB-' + Math.floor(100000 + Math.random() * 900000);
                setTimeout(() => {
                    window.location.href = `thank-you.html?name=${encodeURIComponent(name)}&service=${encodeURIComponent(service)}&ref=${randomRef}`;
                }, 1000);
            } finally {
                // Restore Button State
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.btn-text');
                    const btnSpinner = submitBtn.querySelector('.btn-spinner');
                    if (btnText) btnText.style.display = 'inline-flex';
                    if (btnSpinner) btnSpinner.style.display = 'none';
                }
            }
        });
    }

    function showFormStatus(htmlMessage, type) {
        if (!formStatus) return;
        formStatus.className = `form-status-box ${type}`;
        formStatus.innerHTML = htmlMessage;
        formStatus.style.display = 'flex';

        // Auto scroll to message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto hide after 8 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }
    }

    console.log('Golds Blue Services USA Landing Page Loaded with Google Sheet Lead Integration.');
});