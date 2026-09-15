/**
 * main.js - Lógica Geral de UI (Header, Mobile Menu)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     HEADER SCROLL
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const scrollThreshold = 80;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  // Verifica no carregamento
  updateHeader();
  
  // Escuta o scroll (nativo, já que o Lenis compartilha com ele)
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ==========================================================================
     MOBILE MENU
     ========================================================================== */
  const menuBtn = document.querySelector('.site-header__menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      mobileMenu.classList.add('is-open');
      // Animação de X no botão
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      
      // Travar scroll nativo/Lenis
      document.body.style.overflow = 'hidden';
      if (window.appLenis) window.appLenis.stop();
      
      // Animação Staggering GSAP dos Links
      gsap.fromTo('.mobile-link', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
      );
    } else {
      mobileMenu.classList.remove('is-open');
      // Reverter X
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      
      // Liberar scroll
      document.body.style.overflow = '';
      if (window.appLenis) window.appLenis.start();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Fechar menu ao clicar em links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  /* ==========================================================================
     SMOOTH SCROLL (ANCHOR LINKS)
     ========================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault(); // Evita o salto nativo
        
        // Compensação do header fixo para a rolagem não cobrir o título
        const headerOffset = -80; 
        
        if (window.appLenis) {
          window.appLenis.scrollTo(targetElement, {
            offset: headerOffset,
            duration: 1.2
          });
        } else {
          // Fallback se o Lenis não estiver ativo
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     MAP OVERLAY (Desabilitar UI de mapa cru)
     ========================================================================== */
  const mapOverlay = document.querySelector('.js-map-overlay');
  if (mapOverlay) {
    mapOverlay.addEventListener('click', () => {
      mapOverlay.style.pointerEvents = 'none';
      mapOverlay.style.opacity = '0';
    });
  }

  /* ==========================================================================
     CUSTOM MAGNETIC CURSOR
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Rastreia posição
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Define a posição instantaneamente via GSAP para suavidade ou CSS
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1, // Lag suave
        ease: 'power2.out'
      });
    });

    // Estados de Hover magnético
    const interactiveElements = document.querySelectorAll('a, button, .js-menu-item, .js-map-overlay');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
      });
    });
  }
});
