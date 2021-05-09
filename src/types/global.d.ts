export { }
declare global {
  interface HTMLElement {
    scrollTopMax: number;
    scrollLeftMax: number;
    isMaxScrollTop: boolean;
    isMaxScrollLeft: boolean;
  }

  interface String {
    replaceAll(needle: string, value: string): string;
    insert: (index: number, value: string) => string;
    delete: (from: number, length?: number) => string;
  }
}