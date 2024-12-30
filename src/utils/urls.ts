export default function getDefaultUrls(network: string, timeout: number) {
  const base = network === "main" ? "grid.tf" : `${network}.grid.tf`;
  const urls = {
    gridproxy: `https://gridproxy.${base}`,
    relay: `wss://relay.${base}`,
    tfchain: `wss://tfchain.${base}/ws`,
  };

  if (typeof window !== "undefined") {
    window.env = {
      NETWORK: network,
      GRIDPROXY_URL: urls.gridproxy,
      RELAY_URL: urls.relay,
      TFCHAIN_URL: urls.tfchain,
      TIMEOUT: timeout,
    };
  }
}
