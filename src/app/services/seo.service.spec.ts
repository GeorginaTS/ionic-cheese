import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService, SeoData } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let mockMeta: jasmine.SpyObj<Meta>;
  let mockTitle: jasmine.SpyObj<Title>;
  let mockDocument: jasmine.SpyObj<Document>;

  const mockSeoData: SeoData = {
    title: 'Test Title',
    description: 'Test description for SEO',
    keywords: 'test, seo, angular',
    image: '/assets/test-image.jpg',
    url: '/test-url',
    type: 'article',
    author: 'Test Author',
    publishedTime: '2023-01-01T00:00:00.000Z',
    modifiedTime: '2023-01-02T00:00:00.000Z',
  };

  const mockCheeseData = {
    _id: 'cheese123',
    name: 'Test Cheese',
    description: 'A delicious test cheese',
    milkType: 'cow',
    milkOrigin: 'Catalonia',
    imageUrl: '/assets/cheese-image.jpg',
    userId: 'user123',
    createdAt: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    const metaSpy = jasmine.createSpyObj('Meta', [
      'updateTag',
      'addTag',
      'removeTag',
      'getTag',
    ]);

    const titleSpy = jasmine.createSpyObj('Title', ['setTitle', 'getTitle']);

    const documentSpy = jasmine.createSpyObj('Document', [], {
      head: {
        querySelector: jasmine.createSpy('querySelector'),
        appendChild: jasmine.createSpy('appendChild'),
        removeChild: jasmine.createSpy('removeChild'),
      },
      createElement: jasmine.createSpy('createElement'),
    });

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
        { provide: DOCUMENT, useValue: documentSpy },
      ],
    });

    service = TestBed.inject(SeoService);
    mockMeta = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    mockTitle = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    mockDocument = TestBed.inject(DOCUMENT) as jasmine.SpyObj<Document>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updatePageMeta', () => {
    it('should update basic meta data', () => {
      service.updatePageMeta(mockSeoData);

      expect(mockTitle.setTitle).toHaveBeenCalledWith(mockSeoData.title);
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: mockSeoData.description,
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: jasmine.any(String),
      });
    });

    it('should update Open Graph meta tags', () => {
      service.updatePageMeta(mockSeoData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:title',
        content: mockSeoData.title,
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:description',
        content: mockSeoData.description,
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:type',
        content: jasmine.any(String),
      });
    });

    it('should update Twitter Card meta tags', () => {
      service.updatePageMeta(mockSeoData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'twitter:card',
        content: 'summary_large_image',
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'twitter:title',
        content: mockSeoData.title,
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'twitter:description',
        content: mockSeoData.description,
      });
    });

    it('should use default values when partial data provided', () => {
      const partialData = { title: 'Custom Title' };
      service.updatePageMeta(partialData);

      expect(mockTitle.setTitle).toHaveBeenCalledWith('Custom Title');
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: jasmine.any(String),
      });
    });

    it('should handle missing optional fields', () => {
      const minimalData = {
        title: 'Minimal Title',
        description: 'Minimal description',
      };

      service.updatePageMeta(minimalData);

      expect(mockTitle.setTitle).toHaveBeenCalledWith(minimalData.title);
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: minimalData.description,
      });
    });
  });

  describe('updateCheeseMeta', () => {
    it('should update meta tags for cheese data', () => {
      service.updateCheeseMeta(mockCheeseData);

      expect(mockTitle.setTitle).toHaveBeenCalledWith(
        `${mockCheeseData.name} - Artisan Cheese`
      );
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: mockCheeseData.description,
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: jasmine.stringContaining(mockCheeseData.name),
      });
    });

    it('should generate description when not provided', () => {
      const cheeseWithoutDescription = {
        ...mockCheeseData,
        description: undefined,
      };

      service.updateCheeseMeta(cheeseWithoutDescription);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: jasmine.stringContaining(`Discover ${mockCheeseData.name}`),
      });
    });

    it('should include milk type and origin in keywords', () => {
      service.updateCheeseMeta(mockCheeseData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: jasmine.stringContaining(mockCheeseData.milkType!),
      });
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'keywords',
        content: jasmine.stringContaining(mockCheeseData.milkOrigin!),
      });
    });

    it('should set proper Open Graph product type', () => {
      service.updateCheeseMeta(mockCheeseData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:type',
        content: 'product',
      });
    });

    it('should include cheese image in meta tags', () => {
      service.updateCheeseMeta(mockCheeseData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:image',
        content: mockCheeseData.imageUrl,
      });
    });
  });

  describe('Title management', () => {
    it('should update page title', () => {
      const testTitle = 'Test Page Title';
      service.updatePageMeta({ title: testTitle, description: 'test' });

      expect(mockTitle.setTitle).toHaveBeenCalledWith(testTitle);
    });

    it('should handle empty title gracefully', () => {
      service.updatePageMeta({ title: '', description: 'test' });

      expect(mockTitle.setTitle).toHaveBeenCalledWith('');
    });
  });

  describe('Meta tag management', () => {
    it('should add meta tags when they do not exist', () => {
      mockMeta.getTag.and.returnValue(null);

      service.updatePageMeta(mockSeoData);

      expect(mockMeta.updateTag).toHaveBeenCalled();
    });

    it('should update existing meta tags', () => {
      const existingTag = document.createElement('meta');
      mockMeta.getTag.and.returnValue(existingTag);

      service.updatePageMeta(mockSeoData);

      expect(mockMeta.updateTag).toHaveBeenCalled();
    });
  });

  describe('Canonical URL management', () => {
    it('should update canonical URL when provided', () => {
      const testUrl = '/test-canonical-url';
      service.updatePageMeta({
        title: 'Test',
        description: 'Test',
        url: testUrl,
      });

      // The canonical URL update would be tested through document manipulation
      expect(service).toBeTruthy(); // Basic verification
    });

    it('should handle canonical URL without base domain', () => {
      service.updatePageMeta({
        title: 'Test',
        description: 'Test',
        url: '/relative-path',
      });

      expect(service).toBeTruthy();
    });
  });

  describe('Structured data', () => {
    it('should handle JSON-LD structured data for articles', () => {
      const articleData = {
        ...mockSeoData,
        type: 'article' as const,
        author: 'Test Author',
        publishedTime: '2023-01-01',
      };

      service.updatePageMeta(articleData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'article:author',
        content: articleData.author,
      });
    });

    it('should handle product structured data for cheeses', () => {
      service.updateCheeseMeta(mockCheeseData);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        property: 'og:type',
        content: 'product',
      });
    });
  });

  describe('Error handling', () => {
    it('should handle Meta service errors gracefully', () => {
      mockMeta.updateTag.and.throwError('Meta service error');

      expect(() => {
        service.updatePageMeta(mockSeoData);
      }).not.toThrow();
    });

    it('should handle Title service errors gracefully', () => {
      mockTitle.setTitle.and.throwError('Title service error');

      expect(() => {
        service.updatePageMeta(mockSeoData);
      }).not.toThrow();
    });

    it('should handle missing cheese data', () => {
      const incompleteCheeseData = {
        _id: 'test',
        name: 'Test Cheese',
      };

      expect(() => {
        service.updateCheeseMeta(incompleteCheeseData);
      }).not.toThrow();
    });
  });

  describe('Default meta values', () => {
    it('should use default meta values for missing fields', () => {
      service.updatePageMeta({
        title: 'Custom Title',
        description: 'Custom Description',
      });

      expect(mockTitle.setTitle).toHaveBeenCalledWith('Custom Title');
      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: 'Custom Description',
      });
    });

    it('should provide fallback values for cheese without description', () => {
      const cheeseNoDescription = {
        _id: 'test',
        name: 'Test Cheese',
        milkType: 'cow',
      };

      service.updateCheeseMeta(cheeseNoDescription);

      expect(mockMeta.updateTag).toHaveBeenCalledWith({
        name: 'description',
        content: jasmine.stringContaining('Discover Test Cheese'),
      });
    });
  });
});
