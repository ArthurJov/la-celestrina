/**
 * animations.js - Coreografia GSAP + ScrollTrigger
 */

class AppAnimations {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (this.prefersReducedMotion) return;

    // Registrar plugin
    gsap.registerPlugin(ScrollTrigger);
    
    this.init();
  }

  init() {
    // Escutar término do preloader para iniciar Hero
    window.addEventListener('preloader-done', () => {
      this.playHeroAnimations();
      
      // Delay pequeno para montar os triggers de scroll abaixo da fold
      setTimeout(() => {
        this.initScrollAnimations();
      }, 500);
    });
  }

  playHeroAnimations() {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Eyebrow Tag
    const eyebrow = document.querySelector('.hero__eyebrow');
    if (eyebrow) {
      tl.to(eyebrow, {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, 0);
    }

    // 2. Text Mask (linhas do título)
    const maskInners = document.querySelectorAll('.hero__title .js-mask-inner');
    if (maskInners.length) {
      tl.to(maskInners, {
        y: '0%',
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out'
      }, 0.1);
    }

    // 3. Subtitle
    const subtitle = document.querySelector('.hero__subtitle');
    if (subtitle) {
      tl.to(subtitle, {
        y: 0,
        opacity: 1,
        duration: 0.7
      }, 0.52);
    }

    // 4. CTAs
    const ctas = document.querySelector('.hero__ctas');
    if (ctas) {
      tl.to(ctas, {
        y: 0,
        opacity: 1,
        duration: 0.6
      }, 0.72);
    }

    // 5. Scroll Indicator
    const indicator = document.querySelector('.hero__scroll-indicator');
    if (indicator) {
      tl.to(indicator, {
        opacity: 1,
        duration: 0.4
      }, 1.0);
    }
  }

  initScrollAnimations() {
    // 1. Parallax Imagem Hero
    const heroImg = document.querySelector('.hero__bg-img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // 2. Elementos Genéricos Fade Up
    const fadeElements = document.querySelectorAll('section:not(#hero) .js-fade-up');
    fadeElements.forEach(el => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Dispara quando topo do elem atinge 85% da tela
          toggleActions: "play none none none"
        }
      });
    });

    // 3. Imagem Manifesto Parallax e Revelação
    const manifestoImg = document.querySelector('.manifesto__img-wrapper');
    if (manifestoImg) {
      gsap.to(manifestoImg, {
        scale: 1.0,
        opacity: 1,
        filter: 'brightness(1) grayscale(0)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: manifestoImg,
          start: "top 80%"
        }
      });

      // Parallax persistente interno
      const imgInner = manifestoImg.querySelector('img');
      if (imgInner) {
        gsap.fromTo(imgInner, 
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: manifestoImg,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }
    }

    // 4. Separador Dourado do Manifesto
    const separator = document.querySelector('.manifesto__separator');
    if (separator) {
      gsap.to(separator, {
        width: '100%',
        duration: 0.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: separator,
          start: "top 85%"
        }
      });
    }

    // 5. Itens da Lista do Menu (Staggering)
    const menuItems = document.querySelectorAll('.menu-list__item');
    if (menuItems.length) {
      gsap.fromTo(menuItems, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".menu-list",
            start: "top 80%"
          }
        }
      );
    }

    // 6. Imagens da Galeria (Reveal Individual)
    const galleryItems = document.querySelectorAll('.gallery__item.js-img-reveal');
    galleryItems.forEach(item => {
      gsap.to(item, {
        scale: 1.0,
        opacity: 1,
        filter: 'brightness(1) grayscale(0)',
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%"
        }
      });
    });

    // 7. Hover Reveal do Menu Editorial
    this.initMenuHoverReveal();

    // Refresh final para garantir cálculos corretos
    ScrollTrigger.refresh();
  }

  initMenuHoverReveal() {
    const menuItems = document.querySelectorAll('.js-menu-item');
    const hoverContainer = document.querySelector('.js-menu-hover');
    if (!menuItems.length || !hoverContainer) return;

    const hoverImg = hoverContainer.querySelector('img');
    let hoverVisible = false;

    // Apenas no desktop (pointer fine)
    if (window.matchMedia('(pointer: fine)').matches) {
      menuItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
          const imgSrc = item.getAttribute('data-image');
          if (imgSrc) {
            hoverImg.src = imgSrc;
            if (!hoverVisible) {
              gsap.to(hoverContainer, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
              hoverVisible = true;
            }
          }
        });

        item.addEventListener('mouseleave', () => {
          // Pequeno delay para evitar flickering se pular rápido de um pra outro
          setTimeout(() => {
            const isHoveringAny = Array.from(menuItems).some(el => el.matches(':hover'));
            if (!isHoveringAny) {
              gsap.to(hoverContainer, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
              hoverVisible = false;
            }
          }, 50);
        });

        item.addEventListener('mousemove', (e) => {
          // Segue o mouse dentro do container do menu
          gsap.to(hoverContainer, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            ease: 'power3.out'
          });
        });
      });
    }
  }
}

// Instanciar
window.appAnimations = new AppAnimations();
