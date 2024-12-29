import { Client } from "@threefold/rmb_direct_client";

export async function connectClient(
  mnemonic: string
): Promise<Client | undefined> {
  const client = new Client(
    window.env.TFCHAIN_URL,
    window.env.RELAY_URL,
    mnemonic,
    "test_client",
    "sr25519",
    10
  );

  try {
    await client.connect();
  } catch (err) {
    throw new Error(` Error: ${err}`);
  }
  return client;
}

export async function requestRmb(
  rmbClient: Client,
  destTwinIds: number[],
  cmd: string,
  payload: string,
  expiration = window.env.TIMEOUT,
  retries = 1
) {
  let result;
  try {
    const requestId = await rmbClient.send(
      cmd,
      payload,
      destTwinIds[0],
      expiration / 60,
      retries
    );
    result = await rmbClient.read(requestId);
    return result;
  } catch (e) {
    throw new Error(
      `Failed to request RMB after ${retries} attempts. Error: ${e}`
    );
  }
}

export async function disconnectClient(rmbClient: Client | undefined) {
  if (!rmbClient) return;
  return rmbClient.disconnect();
}
