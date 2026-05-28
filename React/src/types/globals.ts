export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      REACT_APP_API_URL: string;
    };
  }
}
