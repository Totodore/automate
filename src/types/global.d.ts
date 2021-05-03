export { }
declare global {
  interface HTMLElement {
    scrollTopMax: number;
    scrollLeftMax: number;
    isMaxScrollTop: boolean;
    isMaxScrollLeft: boolean;
  }
}