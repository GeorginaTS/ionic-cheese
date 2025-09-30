import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { FocusManagerService } from './focus-manager.service';

describe('FocusManagerService', () => {
  let service: FocusManagerService;
  let mockElementRef: ElementRef;
  let mockElement: HTMLElement;
  let mockActiveElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusManagerService],
    });

    service = TestBed.inject(FocusManagerService);

    // Mock DOM elements
    mockElement = document.createElement('div');
    mockActiveElement = document.createElement('button');

    // Mock ElementRef
    mockElementRef = {
      nativeElement: mockElement,
    };

    // Setup DOM environment
    document.body.innerHTML = '';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('clearFocus', () => {
    it('should handle null elementRef gracefully', () => {
      const nullElementRef = { nativeElement: null };

      expect(() => {
        service.clearFocus(nullElementRef);
      }).not.toThrow();
    });

    it('should handle undefined elementRef gracefully', () => {
      const undefinedElementRef = undefined as any;

      expect(() => {
        service.clearFocus(undefinedElementRef);
      }).not.toThrow();
    });

    it('should blur active element if it exists', () => {
      // Mock document.activeElement
      spyOnProperty(document, 'activeElement', 'get').and.returnValue(
        mockActiveElement
      );
      spyOn(mockActiveElement, 'blur');

      service.clearFocus(mockElementRef);

      expect(mockActiveElement.blur).toHaveBeenCalled();
    });

    it('should handle non-HTMLElement active element', () => {
      // Mock document.activeElement as non-HTMLElement
      const mockSVGElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      spyOnProperty(document, 'activeElement', 'get').and.returnValue(
        mockSVGElement
      );

      expect(() => {
        service.clearFocus(mockElementRef);
      }).not.toThrow();
    });

    it('should blur button-native elements', () => {
      // Create mock button-native elements
      const buttonNative1 = document.createElement('a');
      buttonNative1.className = 'button-native';
      const buttonNative2 = document.createElement('a');
      buttonNative2.className = 'button-native';

      document.body.appendChild(buttonNative1);
      document.body.appendChild(buttonNative2);

      spyOn(buttonNative1, 'blur');
      spyOn(buttonNative2, 'blur');

      service.clearFocus(mockElementRef);

      expect(buttonNative1.blur).toHaveBeenCalled();
      expect(buttonNative2.blur).toHaveBeenCalled();
    });

    it('should blur focusable elements within component', () => {
      // Create focusable elements
      const button = document.createElement('button');
      const input = document.createElement('input');
      const link = document.createElement('a');
      const select = document.createElement('select');
      const textarea = document.createElement('textarea');
      const tabindexElement = document.createElement('div');
      tabindexElement.setAttribute('tabindex', '0');

      mockElement.appendChild(button);
      mockElement.appendChild(input);
      mockElement.appendChild(link);
      mockElement.appendChild(select);
      mockElement.appendChild(textarea);
      mockElement.appendChild(tabindexElement);

      spyOn(button, 'blur');
      spyOn(input, 'blur');
      spyOn(link, 'blur');
      spyOn(select, 'blur');
      spyOn(textarea, 'blur');
      spyOn(tabindexElement, 'blur');

      service.clearFocus(mockElementRef);

      expect(button.blur).toHaveBeenCalled();
      expect(input.blur).toHaveBeenCalled();
      expect(link.blur).toHaveBeenCalled();
      expect(select.blur).toHaveBeenCalled();
      expect(textarea.blur).toHaveBeenCalled();
      expect(tabindexElement.blur).toHaveBeenCalled();
    });

    it('should ignore elements with tabindex="-1"', () => {
      // Create element with tabindex="-1" (should be ignored)
      const nonFocusableElement = document.createElement('div');
      nonFocusableElement.setAttribute('tabindex', '-1');
      mockElement.appendChild(nonFocusableElement);

      spyOn(nonFocusableElement, 'blur');

      service.clearFocus(mockElementRef);

      expect(nonFocusableElement.blur).not.toHaveBeenCalled();
    });

    it('should focus body element after timeout', (done) => {
      spyOn(document.body, 'focus');
      spyOn(document.body, 'setAttribute');
      spyOn(document.body, 'removeAttribute');

      service.clearFocus(mockElementRef);

      setTimeout(() => {
        expect(document.body.setAttribute).toHaveBeenCalledWith(
          'tabindex',
          '-1'
        );
        expect(document.body.focus).toHaveBeenCalled();

        setTimeout(() => {
          expect(document.body.removeAttribute).toHaveBeenCalledWith(
            'tabindex'
          );
          done();
        }, 150);
      }, 150);
    });

    it('should handle errors gracefully', () => {
      // Mock querySelector to throw error
      const originalQuerySelectorAll = document.querySelectorAll;
      spyOn(document, 'querySelectorAll').and.throwError('Mock error');

      spyOn(console, 'error');

      expect(() => {
        service.clearFocus(mockElementRef);
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Error al netejar el focus:',
        jasmine.any(Error)
      );

      // Restore original method
      document.querySelectorAll = originalQuerySelectorAll;
    });

    it('should handle null nativeElement in elementRef', () => {
      const nullNativeElementRef = { nativeElement: null };

      expect(() => {
        service.clearFocus(nullNativeElementRef);
      }).not.toThrow();
    });

    it('should handle elements that are not HTMLElements', () => {
      // Create SVG element (not HTMLElement)
      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      mockElement.appendChild(svgElement);

      expect(() => {
        service.clearFocus(mockElementRef);
      }).not.toThrow();
    });

    it('should log success message', () => {
      spyOn(console, 'log');

      service.clearFocus(mockElementRef);

      expect(console.log).toHaveBeenCalledWith('Focus netejat correctament');
    });
  });

  describe('Accessibility features', () => {
    it('should maintain accessibility by managing focus properly', () => {
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      mockElement.appendChild(button);

      spyOn(button, 'blur');

      service.clearFocus(mockElementRef);

      // Verify focus management
      expect(button.blur).toHaveBeenCalled();
    });

    it('should handle aria-hidden elements correctly', () => {
      const hiddenElement = document.createElement('div');
      hiddenElement.setAttribute('aria-hidden', 'true');

      const button = document.createElement('button');
      hiddenElement.appendChild(button);
      mockElement.appendChild(hiddenElement);

      spyOn(button, 'blur');

      service.clearFocus(mockElementRef);

      // Should still blur focusable elements even if parent is aria-hidden
      expect(button.blur).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty component', () => {
      const emptyElementRef = { nativeElement: document.createElement('div') };

      expect(() => {
        service.clearFocus(emptyElementRef);
      }).not.toThrow();
    });

    it('should handle component with only non-focusable elements', () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      mockElement.appendChild(div);
      mockElement.appendChild(span);

      expect(() => {
        service.clearFocus(mockElementRef);
      }).not.toThrow();
    });

    it('should handle nested focusable elements', () => {
      const parentDiv = document.createElement('div');
      const nestedButton = document.createElement('button');
      parentDiv.appendChild(nestedButton);
      mockElement.appendChild(parentDiv);

      spyOn(nestedButton, 'blur');

      service.clearFocus(mockElementRef);

      expect(nestedButton.blur).toHaveBeenCalled();
    });
  });
});
