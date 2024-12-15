import { Client } from "@threefold/rmb_direct_client";

export async function connectClient() {
  // create client
  const client = new Client(
    "wss://tfchain.dev.grid.tf/ws",
    `wss://relay.dev.grid.tf/`,
    "",
    "test_client",
    "sr25519",
    5
  );
  console.log("client: ", client);

  try {
    await client.connect();
    return client;
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  }
  //   finally {
  //         client.disconnect();
  //       }
}

export async function requestRmb(
  rmbClient: Client,
  command: string,
  payload: any
): Promise<any> {
  const requestID = await rmbClient.send(command, payload, 17, 5);
  // get response
  const response = await rmbClient.read(requestID);
  // print response
  console.log({ response });
  return response;
}

// async request(destTwinIds: number[], cmd: string, payload: string, expiration = 20, retries = 1) {
//   let result;
//   try {
//     const requestId = await this.client.send(cmd, payload, destTwinIds[0], expiration / 60, retries);
//     result = await this.client.read(requestId);
//   } catch (e) {
//     if (e instanceof BaseError) {
//       e.message = formatErrorMessage(
//         `Failed to send request to twinId ${destTwinIds} with command: ${cmd}, payload: ${payload}`,
//         e,
//       );
//       throw e;
//     }
//     throw new RMBError(
//       `Failed to send request to twinId ${destTwinIds} with command: ${cmd}, payload: ${payload} due to ${e}`,
//     );
//   }
//   return result;
// }

// main().then(() => console.log("Done."));
