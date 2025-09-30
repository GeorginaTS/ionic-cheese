import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly defaultMeta = {
    title: 'Caseus - Artisan Cheese Community',
    description:
      'Discover and share artisan cheeses with the Caseus community. Connect with local producers and cheese lovers.',
    keywords:
      'artisan cheese, cheese community, caseus, cheese production, catalan cheeses, artisanal dairy',
    image: '/assets/images/og-default.jpg',
    type: 'website' as const,
  };

  /**
   * Actualitza totes les meta tags de la pàgina
   */
  updatePageMeta(data: Partial<SeoData>): void {
    const seoData = { ...this.defaultMeta, ...data };

    // Title
    this.updateTitle(seoData.title);

    // Basic meta tags
    this.updateBasicMeta(seoData);

    // Open Graph meta tags
    this.updateOpenGraphMeta(seoData);

    // Twitter Cards
    this.updateTwitterMeta(seoData);

    // Canonical URL
    if (seoData.url) {
      this.updateCanonicalUrl(seoData.url);
    }
  }

  /**
   * Meta tags específiques per a formatges
   */
  updateCheeseMeta(cheese: {
    _id: string;
    name: string;
    description?: string;
    milkType?: string;
    milkOrigin?: string;
    imageUrl?: string;
    userId?: string;
    createdAt?: string;
  }): void {
    const cheeseKeywords = [
      'cheese',
      'artisan cheese',
      cheese.name,
      cheese.milkType,
      cheese.milkOrigin,
      'artisanal',
      'caseus',
      'dairy',
    ]
      .filter(Boolean)
      .join(', ');

    const description =
      cheese.description ||
      `Discover ${cheese.name}, an artisan cheese${
        cheese.milkType ? ` made from ${cheese.milkType} milk` : ''
      }${cheese.milkOrigin ? ` from ${cheese.milkOrigin}` : ''}.`;

    this.updatePageMeta({
      title: `${cheese.name} - Artisan Cheese`,
      description,
      keywords: cheeseKeywords,
      image: cheese.imageUrl,
      url: `/community/cheese/${cheese._id}`,
      type: 'product',
      publishedTime: cheese.createdAt,
    });
  }

  /**
   * Meta tags per a perfils d'usuari
   */
  updateUserProfileMeta(user: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    city?: string;
  }): void {
    const userName = user.displayName || 'Caseus User';
    const location = user.city ? ` from ${user.city}` : '';

    this.updatePageMeta({
      title: `${userName} - Caseus Community`,
      description: `${userName}${location}'s profile on Caseus community. Discover and share artisan cheeses with fellow cheese enthusiasts.`,
      keywords: `${userName}, user profile, cheese maker, caseus, community, artisan cheese, dairy producer`,
      image: user.photoURL,
      url: `/user/${user.uid}`,
      type: 'profile',
    });
  }

  /**
   * Meta tags per a la pàgina de comunitat/descobrir
   */
  updateCommunityMeta(): void {
    this.updatePageMeta({
      title: 'Discover Cheeses - Caseus Community',
      description:
        'Explore artisan cheeses shared by the community. Find new flavors and connect with local producers and cheese enthusiasts.',
      keywords:
        'discover cheese, cheese community, artisan cheeses, local producers, caseus, dairy, cheese makers',
      url: '/community',
      type: 'website',
    });
  }

  /**
   * Afegeix structured data (JSON-LD) per millorar el SEO
   */
  addStructuredData(data: Record<string, any>): void {
    // Elimina structured data anterior
    this.removeStructuredData();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  /**
   * Structured data per a formatges
   */
  addCheeseStructuredData(cheese: {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    milkType?: string;
    createdAt?: string;
  }): void {
    const structuredData = {
      '@context': 'https://schema.org/',
      '@type': 'Food',
      name: cheese.name,
      description: cheese.description,
      image: cheese.imageUrl || this.defaultMeta.image,
      category: 'Cheese',
      ...(cheese.milkType && {
        ingredient: [
          {
            '@type': 'Ingredient',
            name: `${cheese.milkType} milk`,
          },
        ],
      }),
      ...(cheese.createdAt && {
        datePublished: cheese.createdAt,
      }),
      publisher: {
        '@type': 'Organization',
        name: 'Caseus',
        logo: {
          '@type': 'ImageObject',
          url: '/assets/img/caseus_logo.svg',
        },
      },
    };

    this.addStructuredData(structuredData);
  }

  /**
   * Neteja totes les meta tags personalitzades
   */
  resetToDefault(): void {
    this.updatePageMeta({});
    this.removeStructuredData();
  }

  private updateTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  private updateBasicMeta(data: SeoData): void {
    this.meta.updateTag({ name: 'description', content: data.description });

    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    this.meta.updateTag({
      name: 'author',
      content: data.author || 'Caseus Community',
    });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  private updateOpenGraphMeta(data: SeoData): void {
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({
      property: 'og:description',
      content: data.description,
    });
    this.meta.updateTag({
      property: 'og:type',
      content: data.type || 'website',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: data.image || this.defaultMeta.image,
    });
    this.meta.updateTag({ property: 'og:site_name', content: 'Caseus' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });

    if (data.url) {
      this.meta.updateTag({
        property: 'og:url',
        content: `https://caseus.app${data.url}`,
      });
    }

    if (data.publishedTime) {
      this.meta.updateTag({
        property: 'article:published_time',
        content: data.publishedTime,
      });
    }

    if (data.modifiedTime) {
      this.meta.updateTag({
        property: 'article:modified_time',
        content: data.modifiedTime,
      });
    }
  }

  private updateTwitterMeta(data: SeoData): void {
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: data.description,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: data.image || this.defaultMeta.image,
    });
    this.meta.updateTag({ name: 'twitter:site', content: '@CaseusApp' });
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(
      'link[rel="canonical"]'
    );

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', `https://cheese-29925.web.app/${url}`);
  }

  private removeStructuredData(): void {
    const existingScript = this.document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
  }
}
