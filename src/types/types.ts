export class ZOSVersionResultModel {
  zos: string | undefined;
  zinit: string | undefined;
}
export interface Node {
  twinId: number;
  nodeId: number;
  version?: string;
}

export interface Profile {
  mnemonic: string;
  network: string;
}
