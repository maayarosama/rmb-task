import { Client } from "@threefold/rmb_direct_client";

export async function connectClient(): Promise<Client | undefined> {
  // create client
  const client = new Client(
    "wss://tfchain.dev.grid.tf/ws",
    `wss://relay.dev.grid.tf/`,
    "",
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
  command: string,
  payload: any,
  destTwinIds: number[] = [17]
): Promise<any> {
  const requestID = await rmbClient.send(
    command,
    payload,
    destTwinIds[0],
    20 / 60,
    5
  );
  const response = await rmbClient.read(requestID);
  return response;
}
