/**
 * Jusan B. Singson - Portfolio Template Interactive Logic
 * Modern ES6+ Script for Theme Switching, Dynamic Tally Cost, Typist engine, and Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Theme Switcher (Dark Mode Default vs Light Mode Toggle)
       ========================================================================== */
    const themeCheckbox = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeCheckbox.checked = true;
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeCheckbox.checked = false;
    }

    // Toggle theme handler
    themeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });


    /* ==========================================================================
       2. Dynamic Typist Typing Engine
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const rolesArray = [
        "IT Desktop Support Professional",
        "WordPress Specialist",
        "Digital Marketing Coordinator",
        "Web Developer",
        "Branding Designer"
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newWordDelay = 2000; // Delay between words
    let roleArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < rolesArray[roleArrayIndex].length) {
            typedTextSpan.textContent += rolesArray[roleArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = rolesArray[roleArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            roleArrayIndex++;
            if (roleArrayIndex >= rolesArray.length) roleArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    // Initialize typing
    if (rolesArray.length && typedTextSpan) {
        setTimeout(type, 1000);
    }


    /* ==========================================================================
       3. About Me Section Navigation Tabs
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Set active class on buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${tabId}`) {
                    content.classList.add('active');
                }
            });
        });
    });


    /* ==========================================================================
       4. Interactive Quote Cost Estimator
       ========================================================================== */
    const serviceInputs = document.querySelectorAll('.calc-input');
    const multiplierInput = document.getElementById('project-multiplier');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const selectionsList = document.getElementById('selections-list');
    const calcSubmitBtn = document.getElementById('calc-submit-btn');

    // Multiplier map labels and coefficients
    const scaleMap = {
        '1': { label: 'Starter Scale', coeff: 1.0 },
        '2': { label: 'Standard Scale', coeff: 1.2 },
        '3': { label: 'Enterprise Scale', coeff: 1.5 }
    };

    function updateCalculator() {
        let baseTally = 0;
        selectionsList.innerHTML = '';

        // Tally checked items
        serviceInputs.forEach(input => {
            if (input.checked) {
                const price = parseFloat(input.dataset.price);
                const title = input.nextElementSibling.querySelector('.calc-item-info span:last-child').textContent;
                
                baseTally += price;

                // Add elements to summary display list
                const li = document.createElement('li');
                li.innerHTML = `<span>${title}</span> <span>$${price}</span>`;
                selectionsList.appendChild(li);
            }
        });

        // Get multiplier
        const currentScale = scaleMap[multiplierInput.value] || scaleMap['2'];
        const finalPrice = Math.round(baseTally * currentScale.coeff);

        // Add multiplier to summary display list
        const scaleLi = document.createElement('li');
        scaleLi.style.borderTop = '1px dashed var(--glass-border)';
        scaleLi.style.paddingTop = '0.5rem';
        scaleLi.style.marginTop = '0.5rem';
        scaleLi.innerHTML = `<span>Scale: ${currentScale.label}</span> <span>x${currentScale.coeff}</span>`;
        selectionsList.appendChild(scaleLi);

        // Update display text
        totalPriceDisplay.textContent = `$${finalPrice}`;
    }

    // Add event listeners for calculator changes
    serviceInputs.forEach(input => input.addEventListener('change', updateCalculator));
    if (multiplierInput) {
        multiplierInput.addEventListener('input', updateCalculator);
    }

    // Set initial calculator view
    if (totalPriceDisplay) {
        updateCalculator();
    }

    // Apply configuration setup and direct to contact form
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', () => {
            const subjectField = document.getElementById('contact-subject');
            const messageField = document.getElementById('contact-msg');
            
            // Build selected list names
            let selectedArr = [];
            serviceInputs.forEach(input => {
                if (input.checked) {
                    const title = input.nextElementSibling.querySelector('.calc-item-info span:last-child').textContent;
                    selectedArr.push(title);
                }
            });

            const currentScale = scaleMap[multiplierInput.value] || scaleMap['2'];
            const price = totalPriceDisplay.textContent;

            // Fill contact inputs
            if (subjectField) {
                subjectField.value = `Quote Request: Custom Package Project`;
            }
            if (messageField) {
                messageField.textContent = `Hello Jusan,\n\nI configured a custom setup using your Interactive Quote Builder:\n` +
                    `- Services: ${selectedArr.join(', ')}\n` +
                    `- Scale: ${currentScale.label} (x${currentScale.coeff})\n` +
                    `- Estimated Investment: ${price}\n\n` +
                    `I would love to discuss this with you. Please get back to me!`;
            }

            // Scroll down smooth to form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    /* ==========================================================================
       5. Flat-Rate Packages Switching (One-Time Project vs Monthly Retainer)
       ========================================================================== */
    const pricingToggleBtn = document.getElementById('pricing-toggle');
    const labelProject = document.getElementById('label-project');
    const labelMonthly = document.getElementById('label-monthly');
    const starterPrice = document.getElementById('price-starter');
    const proPrice = document.getElementById('price-pro');
    const enterprisePrice = document.getElementById('price-enterprise');

    if (pricingToggleBtn) {
        pricingToggleBtn.addEventListener('click', () => {
            pricingToggleBtn.classList.toggle('active');
            
            const isMonthly = pricingToggleBtn.classList.contains('active');

            if (isMonthly) {
                labelProject.classList.remove('active');
                labelMonthly.classList.add('active');

                // Update cards with Monthly values
                starterPrice.innerHTML = `${starterPrice.dataset.monthly}<span>/month</span>`;
                proPrice.innerHTML = `${proPrice.dataset.monthly}<span>/month</span>`;
                enterprisePrice.innerHTML = `${enterprisePrice.dataset.monthly}<span>/month</span>`;
            } else {
                labelMonthly.classList.remove('active');
                labelProject.classList.add('active');

                // Update cards with Project values
                starterPrice.innerHTML = `${starterPrice.dataset.project}<span>/project</span>`;
                proPrice.innerHTML = `${proPrice.dataset.project}<span>/project</span>`;
                enterprisePrice.innerHTML = `${enterprisePrice.dataset.project}<span>/project</span>`;
            }
        });
    }

    // Get Started pricing link clicks
    const pricingActions = document.querySelectorAll('.pricing-action');
    pricingActions.forEach(action => {
        action.addEventListener('click', (e) => {
            const packName = action.getAttribute('data-package');
            const subjectField = document.getElementById('contact-subject');
            const messageField = document.getElementById('contact-msg');

            if (subjectField) {
                subjectField.value = `Order: ${packName} Package`;
            }
            if (messageField) {
                const planType = (pricingToggleBtn && pricingToggleBtn.classList.contains('active')) ? 'Monthly Retainer' : 'One-Time Project';
                messageField.textContent = `Hello Jusan,\n\nI am interested in your "${packName}" plan under the ${planType} structure. Let's discuss details and timelines. Thank you!`;
            }
        });
    });


    /* ==========================================================================
       6. Intersection Observer for Skills Bar Animation
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    const percentSpans = document.querySelectorAll('.skill-percent');

    const animateSkills = () => {
        progressBars.forEach((bar, idx) => {
            const percentSpan = percentSpans[idx];
            const targetVal = parseInt(percentSpan.dataset.target);

            // Animate width
            bar.style.width = `${targetVal}%`;

            // Counter effect numbers
            let count = 0;
            const counterInterval = setInterval(() => {
                if (count >= targetVal) {
                    percentSpan.textContent = `${targetVal}%`;
                    clearInterval(counterInterval);
                } else {
                    count++;
                    percentSpan.textContent = `${count}%`;
                }
            }, 15);
        });
    };

    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }


    /* ==========================================================================
       7. Scroll-spy Active Navbar Links Highlight
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 150;
            const sectionHeight = sec.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       6.5. Design Portfolio Filter and Lightbox System
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let visibleItems = Array.from(portfolioItems);
    let currentImageIndex = 0;

    // Filter portfolio items
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Update visible items array for lightbox cycling
            visibleItems = Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));
        });
    });

    // Lightbox helper to show image at index
    function showLightboxImage(index) {
        if (visibleItems.length === 0) return;
        currentImageIndex = index;
        const item = visibleItems[index];
        const src = item.getAttribute('data-src');
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');

        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
    }

    // Open lightbox when clicking an item
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = visibleItems.indexOf(item);
            if (index !== -1) {
                showLightboxImage(index);
                lightbox.classList.add('active');
            }
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on clicking backdrop
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Next image
    function nextImage() {
        let newIndex = currentImageIndex + 1;
        if (newIndex >= visibleItems.length) {
            newIndex = 0;
        }
        showLightboxImage(newIndex);
    }

    // Prev image
    function prevImage() {
        let newIndex = currentImageIndex - 1;
        if (newIndex < 0) {
            newIndex = visibleItems.length - 1;
        }
        showLightboxImage(newIndex);
    }

    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });


    /* ==========================================================================
       8. Mobile Hamburger Navigation Menu Toggle
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Toggle hamburger / close icons
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu on link clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }


    /* ==========================================================================
       9. Contact Form Interactive Submit
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successNotice = document.getElementById('form-success');

    if (contactForm && successNotice) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear textareas and inputs after feedback loop simulation
            contactForm.reset();

            // Reveal notification
            successNotice.style.display = 'block';

            // Automatically hide success notification after 5s
            setTimeout(() => {
                successNotice.style.display = 'none';
            }, 6000);
            
            // Scroll success notification into view
            successNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

});
