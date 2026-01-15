import { Injectable, NgZone, inject } from '@angular/core';

/**
 * Motion service - handles parallax and reveal-on-scroll effects
 * Honors prefers-reduced-motion for accessibility.
 */
@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private readonly ngZone = inject(NgZone);
  private readonly motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  private parallaxElements: HTMLElement[] = [];
  private revealObserver: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private motionListener: ((event: MediaQueryListEvent) => void) | null = null;

  init(): void {
    this.destroy();
    this.refreshTargets();
    document.body.classList.add('motion-enabled');
    this.handleMotionPreference(this.motionQuery.matches);
    this.addMotionPreferenceListener();
  }

  destroy(): void {
    this.disconnectRevealObserver();
    this.removeParallaxListeners();
    this.removeMotionPreferenceListener();
    this.cancelAnimationFrame();
    document.body.classList.remove('motion-enabled');
  }

  private refreshTargets(): void {
    this.parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]')
    );
  }

  /**
   * Refresh motion targets after dynamic content/render updates.
   */
  refresh(): void {
    this.refreshTargets();
    if (this.motionQuery.matches) {
      this.disconnectRevealObserver();
      this.initParallax();
      this.initReveal();
    } else {
      this.resetParallax();
      this.showAllReveals();
    }
  }

  private handleMotionPreference(reduced: boolean): void {
    if (reduced) {
      this.resetParallax();
      this.showAllReveals();
      return;
    }

    this.initParallax();
    this.initReveal();
  }

  private initParallax(): void {
    if (!this.parallaxElements.length) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        if (this.rafId !== null) {
          return;
        }
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          this.updateParallax();
        });
      };

      this.resizeListener = this.scrollListener;
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      window.addEventListener('resize', this.resizeListener, { passive: true });
      this.updateParallax();
    });
  }

  private updateParallax(): void {
    const scrollY = window.scrollY;
    this.parallaxElements.forEach((element) => {
      const rawSpeed1 = Number(element.dataset['parallaxSpeed'] ?? 0.12);
      const rawSpeed2 = Number(element.dataset['parallaxSpeed2'] ?? 0.22);
      const speed1 = Number.isFinite(rawSpeed1) ? rawSpeed1 : 0.12;
      const speed2 = Number.isFinite(rawSpeed2) ? rawSpeed2 : 0.22;
      const offset = scrollY - element.offsetTop;

      element.style.setProperty('--parallax-y-1', `${offset * speed1}px`);
      element.style.setProperty('--parallax-y-2', `${offset * speed2}px`);
    });
  }

  private removeParallaxListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  private resetParallax(): void {
    this.removeParallaxListeners();
    this.parallaxElements.forEach((element) => {
      element.style.setProperty('--parallax-y-1', '0px');
      element.style.setProperty('--parallax-y-2', '0px');
    });
  }

  private initReveal(): void {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal-on-scroll')
    );
    if (!revealElements.length) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-in');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.2
        }
      );

      revealElements.forEach((element) => this.revealObserver?.observe(element));
    });
  }

  private showAllReveals(): void {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal-on-scroll')
    );
    revealElements.forEach((element) => element.classList.add('reveal-in'));
  }

  private disconnectRevealObserver(): void {
    if (this.revealObserver) {
      this.revealObserver.disconnect();
      this.revealObserver = null;
    }
  }

  private cancelAnimationFrame(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private addMotionPreferenceListener(): void {
    this.motionListener = (event: MediaQueryListEvent) => {
      this.disconnectRevealObserver();
      this.resetParallax();
      this.handleMotionPreference(event.matches);
    };

    const mq = this.motionQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', this.motionListener);
    } else if (typeof mq.addListener === 'function') {
      // Safari fallback
      mq.addListener(this.motionListener);
    }
  }

  private removeMotionPreferenceListener(): void {
    if (!this.motionListener) {
      return;
    }

    const mq = this.motionQuery as MediaQueryList & {
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    if (typeof mq.removeEventListener === 'function') {
      mq.removeEventListener('change', this.motionListener);
    } else if (typeof mq.removeListener === 'function') {
      // Safari fallback
      mq.removeListener(this.motionListener);
    }

    this.motionListener = null;
  }
}
