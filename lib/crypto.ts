import CryptoJS from "crypto-js";

// Ensure we have a sufficiently secure secret in env, or use a default for dev (warn in prod)
const SECRET = process.env.ENCRYPTION_KEY || "dev-secret-key-change-me";

export function encryptData(data: any): string {
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, SECRET).toString();
}

export function decryptData(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
}
