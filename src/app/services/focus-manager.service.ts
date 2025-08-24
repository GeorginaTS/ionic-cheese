import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusManagerService {

  constructor() { }

  /**
   * Neteja el focus de tots els elements enfocables dins d'un component
   * per evitar problemes d'accessibilitat amb aria-hidden
   */
  clearFocus(elementRef: ElementRef): void {
    try {
      // 1. Alliberar el focus de l'element actiu actual
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // 2. Troba elements específics de tipus button-native i aplica blur
      const buttonNatives = document.querySelectorAll('a.button-native');
      buttonNatives.forEach((element: Element) => {
        if (element instanceof HTMLElement) {
          element.blur();
        }
      });

      // 3. Aplica blur a tots els elements enfocables dins del component
      if (elementRef && elementRef.nativeElement) {
        const focusableElements = elementRef.nativeElement.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((element: Element) => {
          if (element instanceof HTMLElement) {
            element.blur();
          }
        });
      }

      // 4. Mou el focus al body
      setTimeout(() => {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        // Eliminem l'atribut tabindex després de donar focus per evitar altres problemes d'accessibilitat
        setTimeout(() => document.body.removeAttribute('tabindex'), 100);
      }, 100);

      console.log('Focus netejat correctament');
    } catch (error) {
      console.error('Error al netejar el focus:', error);
    }
  }
}