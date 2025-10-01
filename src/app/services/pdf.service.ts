import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, Observable, firstValueFrom } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type {
  TDocumentDefinitions,
  PageSize,
  Content,
  StyleDictionary,
} from 'pdfmake/interfaces';
import { Cheese } from '../interfaces/cheese';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FirebaseStorageService } from './firebase-storage.service';

// Configure pdfMake with fonts - use any cast to avoid immutability error
const pdfMakeAny = pdfMake as any;
const pdfFontsAny = pdfFonts as any;
if (pdfFontsAny && pdfFontsAny.pdfMake && pdfFontsAny.pdfMake.vfs) {
  pdfMakeAny.vfs = pdfFontsAny.pdfMake.vfs;
}

// Minimal interface to type the object returned by pdfMake.createPdf
interface PdfInstance {
  getBase64(cb: (data: string) => void): void;
  getBlob(cb: (blob: Blob) => void): void;
  download(fileName?: string): void;
}

@Injectable({ providedIn: 'root' })
export class PdfService {
  private http = inject(HttpClient);
  private storage = inject(FirebaseStorageService);

  // Public API
  exportCheese$(cheese: Cheese): Observable<void> {
    return defer(async () => {
      // Try to load images
      const heroDataUrl = await this.resolveCheeseHeroImage(cheese);
      const gallery = await this.resolveCheeseGallery(cheese, 3);

      const docDefinition = this.buildCheeseDoc(
        cheese,
        heroDataUrl ?? undefined,
        gallery
      );
      const pdf = pdfMake.createPdf(docDefinition) as unknown as PdfInstance;

      if (!Capacitor.isNativePlatform()) {
        pdf.download(this.safeFilename(`${cheese.name}.pdf`));
        return;
      }

      const base64 = await this.getPdfBase64(pdf);
      await Filesystem.writeFile({
        path: this.safeFilename(`${cheese.name}.pdf`),
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });
    });
  }

  exportCheeses$(cheeses: Cheese[]): Observable<void> {
    return defer(async () => {
      const sections: Content[] = [];
      for (const c of cheeses) {
        const hero = await this.resolveCheeseHeroImage(c);
        const gallery = await this.resolveCheeseGallery(c, 3);
        sections.push(
          ...this.buildCheeseSection(c, hero ?? undefined, gallery),
          { text: '', pageBreak: 'after' }
        );
      }
      if (sections.length) sections.pop(); // remove last pageBreak

      const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4' as PageSize,
        pageMargins: [40, 40, 40, 40],
        content: sections,
        styles: this.styles,
      };

      const pdf = pdfMake.createPdf(docDefinition) as unknown as PdfInstance;

      if (!Capacitor.isNativePlatform()) {
        pdf.download(this.safeFilename('cheeses.pdf'));
        return;
      }

      const base64 = await this.getPdfBase64(pdf);
      await Filesystem.writeFile({
        path: this.safeFilename('cheeses.pdf'),
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });
    });
  }

  // Document builders
  private buildCheeseDoc(
    cheese: Cheese,
    hero?: string,
    gallery: string[] = []
  ): TDocumentDefinitions {
    return {
      pageSize: 'A4' as PageSize,
      pageMargins: [40, 40, 40, 40],
      styles: this.styles,
      content: this.buildCheeseSection(cheese, hero, gallery),
    };
  }

  private buildCheeseSection(
    cheese: Cheese,
    hero?: string,
    gallery: string[] = []
  ): Content[] {
    const header = {
      columns: [
        { text: cheese.name, style: 'title' },
        {
          text: this.formatDate(cheese.date),
          alignment: 'right',
          style: 'meta',
        },
      ],
      margin: [0, 0, 0, 12],
    };

    // Try to include hero image if available
    const heroBlock = hero
      ? { image: hero, width: 420, margin: [0, 0, 0, 12] }
      : {
          text: cheese.imageUrl ? '📷 Image not available' : 'No image',
          italics: true,
          color: '#888',
          margin: [0, 0, 0, 12],
        };

    const basicInfo = {
      table: {
        widths: ['auto', '*', 'auto', '*'],
        body: [
          [
            { text: 'Milk Type', bold: true },
            cheese.milkType ?? '-',
            { text: 'Origin', bold: true },
            cheese.milkOrigin ?? '-',
          ],
          [
            { text: 'Milk Quantity', bold: true },
            cheese.milkQuantity != null ? `${cheese.milkQuantity} L` : '-',
            { text: 'Likes', bold: true },
            `${cheese.likedBy?.length ?? cheese.likesCount ?? 0}`,
          ],
        ],
      },
      layout: 'lightHorizontalLines',
      margin: [0, 0, 0, 10],
    };

    const making = cheese.making;
    const makingTable = making
      ? {
          table: {
            widths: ['auto', '*', 'auto', '*'],
            body: [
              [
                { text: 'Milk Temp', bold: true },
                making.milkTemperature ?? '-',
                { text: 'Starter', bold: true },
                making.starterCultures ?? '-',
              ],
              [
                { text: 'Coagulant', bold: true },
                making.coagulant ?? '-',
                { text: 'Coag. Time', bold: true },
                making.coagulationTime ?? '-',
              ],
              [
                { text: 'Milk pH', bold: true },
                making.milkPH ?? '-',
                { text: 'Curd Cutting', bold: true },
                making.curdCutting ?? '-',
              ],
              [
                { text: 'Molding', bold: true },
                making.molding ?? '-',
                { text: 'Pressure', bold: true },
                making.appliedPressure ?? '-',
              ],
              [{ text: 'Salting', bold: true }, making.salting ?? '-', '', ''],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        }
      : undefined;

    const ripening = cheese.ripening;
    const ripeningTable = ripening
      ? {
          table: {
            widths: ['auto', '*', 'auto', '*'],
            body: [
              [
                { text: 'Start', bold: true },
                this.formatDate(ripening.ripeningStartDate),
                { text: 'Duration', bold: true },
                ripening.estimatedDuration ?? '-',
              ],
              [
                { text: 'Temp', bold: true },
                ripening.temperature ?? '-',
                { text: 'Humidity', bold: true },
                ripening.humidity ?? '-',
              ],
              [
                { text: 'Flips', bold: true },
                ripening.turningFlips ?? '-',
                { text: 'Washing', bold: true },
                ripening.washing ?? '-',
              ],
              [
                { text: 'Brushing', bold: true },
                ripening.brushing ?? '-',
                '',
                '',
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        }
      : undefined;

    const tasteBlock = cheese.taste
      ? this.buildTasteSection(cheese)
      : undefined;

    const description = cheese.description
      ? { text: cheese.description, margin: [0, 0, 0, 10] }
      : undefined;

    // Gallery images if available
    const galleryBlock = gallery.length
      ? {
          columns: gallery.map((g) => ({
            image: g,
            width: 160,
            margin: [0, 4, 8, 0],
          })),
          columnGap: 8,
          margin: [0, 6, 0, 0],
        }
      : undefined;

    return [
      header,
      heroBlock,
      basicInfo,
      makingTable,
      ripeningTable,
      tasteBlock,
      description,
      galleryBlock,
    ].filter(Boolean) as Content[];
  }

  private styles: StyleDictionary = {
    title: { fontSize: 20, bold: true, color: '#111' },
    meta: { fontSize: 10, color: '#666' },
    sectionTitle: { fontSize: 14, bold: true, margin: [0, 6, 0, 4] },
    muted: { color: '#666', fontSize: 10 },
  };

  // Utils
  private async getPdfBase64(pdf: PdfInstance): Promise<string> {
    return new Promise<string>((resolve) =>
      pdf.getBase64((b64) => resolve(b64))
    );
  }

  private formatDate(d?: string | Date): string {
    if (!d) return '-';
    const date = typeof d === 'string' ? new Date(d) : d;
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  }

  private safeFilename(name: string): string {
    return name.replace(/[\\/:*?"<>|]+/g, '_');
  }

  // ------- Taste section helpers -------
  private buildTasteSection(cheese: Cheese): Content {
    const t = cheese.taste;
    if (!t) return { text: '' };

    const rows: Content[] = [];
    const entries: Array<[label: string, rate?: number, text?: string]> = [
      ['Visual', t.visual?.rate, t.visual?.text],
      ['Aroma', t.aroma?.rate, t.aroma?.text],
      ['Texture', t.texture?.rate, t.texture?.text],
      ['Flavor', t.flavor?.rate, t.flavor?.text],
      ['Overall', t.taste?.rate, t.taste?.text],
    ];

    for (const [label, rate, note] of entries) {
      if (rate != null) {
        rows.push({ text: label, style: 'sectionTitle' });
        if (rate != null) {
          rows.push({ text: `${this.stars(rate)} ${rate}/5`, style: 'muted' });
        }
      }
    }

    return {
      stack: [{ text: 'Taste Profile', style: 'sectionTitle' }, ...rows],
    };
  }

  private stars(rate?: number): string {
    const r = Math.max(0, Math.min(5, Math.floor(rate ?? 0)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  // ------- Image loading helpers -------
  private async resolveCheeseHeroImage(cheese: Cheese): Promise<string | null> {
    // Prefer provided imageUrl if available
    if (cheese.imageUrl) {
      try {
        return await this.imageToDataUrl(cheese.imageUrl);
      } catch (error) {
        console.warn('Failed to load hero image from imageUrl:', error);
      }
    }

    // Try conventional Storage path if id is known
    if (cheese._id) {
      try {
        const url = await this.storage.getImageUrl(
          `cheeses/${cheese._id}/${cheese._id}-1.jpeg`
        );
        return await this.imageToDataUrl(url);
      } catch (error) {
        console.warn('Failed to load hero image from storage:', error);
      }
    }
    return null;
  }

  private async resolveCheeseGallery(
    cheese: Cheese,
    count = 3
  ): Promise<string[]> {
    const out: string[] = [];
    if (cheese._id) {
      for (let i = 2; i <= count + 1; i++) {
        try {
          const url = await this.storage.getImageUrl(
            `cheeses/${cheese._id}/${cheese._id}-${i}.jpeg`
          );
          const dataUrl = await this.imageToDataUrl(url);
          out.push(dataUrl);
        } catch (error) {
          console.warn(`Failed to load gallery image ${i}:`, error);
        }
      }
    }
    return out;
  }

  private async imageToDataUrl(url: string): Promise<string> {
    try {
      // Use HttpClient to fetch with proper headers
      const blob = await firstValueFrom(
        this.http.get(url, { responseType: 'blob' })
      );
      return await this.blobToDataUrl(blob);
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      throw error;
    }
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
