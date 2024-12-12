declare module 'pdfmake/build/pdfmake' {
  interface TFontFamily {
    normal?: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
  }

  interface TDocumentInformation {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modDate?: Date;
    trapped?: unknown;
  }

  interface TDocumentDefinitions {
    content: unknown[];
    styles?: Record<string, unknown>;
    images?: Record<string, unknown>;
    defaultStyle?: {
      font?: string;
    };
    pageSize?: string;
    pageOrientation?: 'portrait' | 'landscape';
    pageMargins?: [number, number, number, number];
    info?: TDocumentInformation;
    compress?: boolean;
    userPassword?: string;
    ownerPassword?: string;
    permissions?: {
      printing?: 'highResolution' | 'lowResolution';
      modifying?: boolean;
      copying?: boolean;
      annotating?: boolean;
      fillingForms?: boolean;
      contentAccessibility?: boolean;
      documentAssembly?: boolean;
    };
    version?: string;
    watermark?: unknown;
  }

  interface PDFMake {
    createPdf(documentDefinitions: TDocumentDefinitions): {
      download(defaultFileName?: string, cb?: () => void): void;
      getDataUrl(cb: (result: string) => void): void;
      getBlob(cb: (result: Blob) => void): void;
    };
    vfs: Record<string, string>;
    fonts: {
      [name: string]: TFontFamily;
    };
  }

  const pdfMake: PDFMake;
  export = pdfMake;
}
