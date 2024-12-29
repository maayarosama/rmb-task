import { validateMnemonic } from "bip39";

export const isVersionValid = [
  (v: string) => !!v || "Field is required.",
  (v: string) =>
    /^v\d+\.\d+\.\d+$/.test(v) || "Version must follow the format 'v1.1.1'.", // Check version structure
];
export const isMnemonic = [
  (v: string) => !!v || "Mnemonic is required.",
  (v: string) =>
    (v && validateMnemonic(v)) || "Mnemonic doesn't seem to be valid.",
];

export const isNumber = [
  (v: number) => {
    const numberValue = Number(v);
    return (
      (Number.isInteger(numberValue) && numberValue > 0) ||
      "The value must be a positive integer."
    );
  },
];

export const isCommand = [
  (v: string) => !!v || "This field is required.",
  (v: string) => {
    const parts = v.split(".");
    return (
      (parts.length === 3 && parts.every((part) => part.trim() !== "")) ||
      "Command doesn't seem to be valid."
    );
  },
];

export const isJson = [
  (v: string) => {
    if (v.trim() === "") return true;
    try {
      JSON.parse(v);
      return true;
    } catch (e) {
      return "Payload doesn't seem to be a valid JSON.";
    }
  },
];
