declare module 'html-pdf-node' {
  interface Options {
    format?: string;
    path?: string;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    printBackground?: boolean;
    landscape?: boolean;
    scale?: number;
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    pageRanges?: string;
    width?: string | number;
    height?: string | number;
  }

  interface File {
    content?: string;
    url?: string;
  }

  function generatePdf(file: File, options?: Options): Promise<Buffer>;
  function generatePdfs(files: File[], options?: Options): Promise<Buffer[]>;

  export = {
    generatePdf,
    generatePdfs,
  };
}
