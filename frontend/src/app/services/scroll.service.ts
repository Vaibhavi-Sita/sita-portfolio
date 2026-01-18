import { Injectable, signal, NgZone, inject, OnDestroy } from '@angular/core';

/**
 * Service to handle scroll-related functionality
 * Uses IntersectionObserver to track active sections
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollService implements OnDestroy {
  private readonly ngZone = inject(NgZone);
  private observer: IntersectionObserver | null = null;
  private observedElements = new Map<string, Element>();

  // Reactive state
  readonly activeSection = signal<string>('home');
  readonly isScrolled = signal<boolean>(false);

  private scrollListener: (() => void) | null = null;

  constructor() {
    this.initScrollListener();
  }

  ngOnDestroy(): void {
    this.destroyObserver();
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Initialize the IntersectionObserver for section tracking
   */
  initSectionObserver(sectionIds: string[]): void {
    // Destroy existing observer if any
    this.destroyObserver();

    // Create new observer outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          // Find the most visible section
          let maxRatio = 0;
          let mostVisibleSection = this.activeSection();

          entries.forEach((entry) => {
            const sectionId = entry.target.id;
            
            // Update if this section is more visible than current max
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisibleSection = sectionId;
            }
          });

          // Also check all observed elements for their current visibility
          this.observedElements.forEach((element, id) => {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Prioritize sections that are in the top portion of the viewport
            if (rect.top <= viewportHeight * 0.4 && rect.bottom > viewportHeight * 0.2) {
              if (rect.top <= 100 || (maxRatio < 0.5 && rect.top < viewportHeight * 0.3)) {
                mostVisibleSection = id;
              }
            }
          });

          // Update active section in Angular zone
          this.ngZone.run(() => {
            if (mostVisibleSection !== this.activeSection()) {
              this.activeSection.set(mostVisibleSection);
            }
          });
        },
        {
          root: null,
          rootMargin: '-20% 0px -60% 0px',
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        }
      );

      // Observe each section, retrying briefly for late-rendered content (e.g., hero)
      this.observeSections(sectionIds);
    });
  }

  /**
   * Try to observe provided section IDs, with a few retries for late DOM availability.
   */
  private observeSections(sectionIds: string[], attempt = 0): void {
    const missing: string[] = [];

    sectionIds.forEach((id) => {
      if (this.observedElements.has(id)) {
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        this.observer?.observe(element);
        this.observedElements.set(id, element);
      } else {
        missing.push(id);
      }
    });

    if (missing.length && attempt < 5) {
      setTimeout(() => this.observeSections(missing, attempt + 1), 200);
    }
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: sectionId === 'home' ? 0 : offsetPosition,
        behavior: 'smooth'
      });

      // Update active section immediately for better UX
      this.activeSection.set(sectionId);

      // Update URL hash without triggering scroll
      history.pushState(null, '', `#${sectionId}`);
    }
  }

  /**
   * Initialize scroll listener for navbar background
   */
  private initScrollListener(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const scrolled = window.scrollY > 50;
        if (scrolled !== this.isScrolled()) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolled);
          });
        }
      };

      window.addEventListener('scroll', this.scrollListener, { passive: true });
    });
  }

  /**
   * Destroy the IntersectionObserver
   */
  private destroyObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.observedElements.clear();
  }

  /**
   * Handle initial hash in URL
   */
  handleInitialHash(): void {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Delay to ensure DOM is ready
      setTimeout(() => {
        this.scrollToSection(hash);
      }, 100);
    }
  }
}
