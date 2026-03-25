document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- 2. Sticky Navbar & Active Link Update on Scroll ---
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        let current = '';

        // Sticky Navbar styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (backToTopBtn) backToTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            if (backToTopBtn) backToTopBtn.classList.remove('show');
        }

        // Active Link based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // --- 3. Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // --- 4. Form Submission (Native HTML POST) ---
    // The AJAX fetch request was removed because browsers block AJAX POST requests
    // from local "file:///" addresses due to strict CORS security policies. 
    // Standard HTML form submission (native POST) handles this perfectly.

    // --- 5. Smooth Scroll for internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 6. Drag / Touch swipe support for horizontal scroll wrappers ---
    (function enableHorizontalDrag() {
      const selectors = ['.services-scroll-wrapper', '.blog-scroll-wrapper'];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          let isDown = false;
          let startX = 0;
          let scrollLeft = 0;

          // Pointer events (covers mouse and touch on supporting browsers)
          el.addEventListener('pointerdown', (e) => {
            isDown = true;
            el.setPointerCapture(e.pointerId);
            el.classList.add('dragging');
            startX = e.clientX;
            scrollLeft = el.scrollLeft;
          });

          el.addEventListener('pointerup', (e) => {
            isDown = false;
            try { el.releasePointerCapture(e.pointerId); } catch (err) {}
            el.classList.remove('dragging');
          });

          el.addEventListener('pointercancel', () => {
            isDown = false;
            el.classList.remove('dragging');
          });

          el.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.clientX;
            const walk = (x - startX) * 1; // adjust multiplier for speed
            el.scrollLeft = scrollLeft - walk;
          });

          // Fallback mouse events for older browsers
          el.addEventListener('mousedown', (e) => {
            isDown = true;
            el.classList.add('dragging');
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
          });
          window.addEventListener('mouseup', () => { isDown = false; el.classList.remove('dragging'); });
          el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('dragging'); });
          el.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1;
            el.scrollLeft = scrollLeft - walk;
          });

          // touch support (passive handlers for smoother scrolling)
          el.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
          }, {passive: true});
          el.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - el.offsetLeft;
            const walk = (x - startX);
            el.scrollLeft = scrollLeft - walk;
          }, {passive: true});

          // Convert vertical wheel to horizontal scroll when hovering the container
          el.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.preventDefault();
              el.scrollLeft += e.deltaY;
            }
          }, {passive: false});
        });
      });
    })();

});
