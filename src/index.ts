export {};

declare global {
  interface Window {
    env: {
      NETWORK: string;
      GRIDPROXY_URL: string;
      RELAY_URL: string;
      TFCHAIN_URL: string;
    };
  }
}
