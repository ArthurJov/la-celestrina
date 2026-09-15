/**
 * lenis.js - Smooth Scroll
 */

// Evitar inicialização dupla
if (!window.appLenis) {
  // Proporção exata para sensação "amanteigada"
  const lenis = new Lenis({
    lerp: 0.075,          // Inércia: quanto menor, mais demorado o frenagem
    smoothWheel: true,    // Scroll com mouse aveludado
    syncTouch: false,     // Touch nativo no mobile (não sobreescrever)
    duration: 1.2,
  });

  // Integrar ao RAF global do Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Integrar com GSAP ScrollTrigger
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  window.appLenis = lenis;
}
