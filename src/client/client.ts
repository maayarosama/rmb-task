import { Client } from "@threefold/rmb_direct_client";

export async function connectClient(): Promise<Client | undefined> {
  const client = new Client(
    "wss://tfchain.dev.grid.tf/ws",
    `wss://relay.dev.grid.tf/`,
    "<mnemonic>",
    "test_client",
    "sr25519",
    10
  );

  try {
    await client.connect();
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
    return undefined;
  }
  return client;
}

export async function requestRmb(
  rmbClient: Client,
  destTwinIds: number[],
  cmd: string,
  payload: string,
  expiration = 20,
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
  } catch (e) {
    console.error(e);
  }
  return result;
}
