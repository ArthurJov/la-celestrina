/**
 * preloader.js - Coreografia da Splash Screen
 */

class Preloader {
  constructor() {
    this.el = document.querySelector('#preloader');
    this.logo = document.querySelector('.preloader__logo');
    this.heroImg = document.querySelector('.hero__bg-img');
    
    // Fallback: se houver erro e não carregar, libera a tela após 5s
    this.timeout = setTimeout(() => this.hide(), 5000);
    
    this.init();
  }
  
  init() {
    // 1. Mostrar logo no preloader (Entrada)
    setTimeout(() => {
      if (this.logo) {
        this.logo.style.opacity = '1';
        this.logo.style.transform = 'scale(1)';
      }
    }, 150); // Delay mínimo
    
    // 2. Aguardar carregamento do site e da imagem Hero
    window.addEventListener('load', () => this.checkAssets());
  }
  
  checkAssets() {
    // Garantir que a imagem hero carregou antes de remover preloader
    if (!this.heroImg) {
      this.hide();
      return;
    }
    
    if (this.heroImg.complete) {
      this.hide();
    } else {
      this.heroImg.addEventListener('load', () => this.hide());
      this.heroImg.addEventListener('error', () => this.hide());
    }
  }
  
  hide() {
    clearTimeout(this.timeout);
    
    // Fase 1: Desaparece o Logo
    if (this.logo) {
      this.logo.style.transition = 'opacity 500ms ease-out';
      this.logo.style.opacity = '0';
    }
    
    // Fase 2: Preloader sobe (Clip-path)
    setTimeout(() => {
      if (this.el) {
        this.el.style.clipPath = 'inset(0 0 100% 0)';
      }
      
      // Liberar scroll
      document.body.classList.remove('is-loading');
      
      // Disparar evento global para iniciar outras animações (Hero, etc)
      window.dispatchEvent(new CustomEvent('preloader-done'));
      
    }, 300); // 300ms após logo desaparecer
    
    // Fase 3: Remover do DOM
    setTimeout(() => {
      if (this.el) {
        this.el.remove();
      }
    }, 1000);
  }
}

// Inicializar apenas se não tivermos preferência de movimento reduzido
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.appPreloader = new Preloader();
} else {
  // Fallback rápido
  document.body.classList.remove('is-loading');
  const pl = document.querySelector('#preloader');
  if (pl) pl.remove();
  setTimeout(() => window.dispatchEvent(new CustomEvent('preloader-done')), 100);
}
