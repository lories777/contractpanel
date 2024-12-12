declare module 'pdfmake/build/pdfmake' {
  interface TFontFamily {
    normal?: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
  }

  interface TDocumentDefinitions {
    content: any[];
    styles?: Record<string, any>;
    defaultStyle?: Record<string, any>;
  }

  interface TCreatedPdf {
    getBuffer(callback: (buffer: Buffer) => void): void;
  }

  interface PdfMakeStatic {
    vfs: Record<string, any>;
    fonts: Record<string, TFontFamily>;
    createPdf(documentDefinition: TDocumentDefinitions): TCreatedPdf;
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfs: {
    pdfMake: {
      vfs: Record<string, any>;
    };
  };
  export default vfs;
}
