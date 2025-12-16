// utils/hillCipher.js

// Convert character to number (A-Z -> 0-25)
const charToNum = (c) => c.toUpperCase().charCodeAt(0) - 65;
const numToChar = (n) => String.fromCharCode((n % 26) + 65);

// Simple 2x2 Hill Cipher key (should be invertible mod 26)
const keyMatrix = [
  [3, 3],
  [2, 5],
];

// Encrypt plaintext (A-Z only)
export function hillEncrypt(text) {
  text = text.toUpperCase().replace(/[^A-Z]/g, "");
  if (text.length % 2 !== 0) text += "X";

  let encrypted = "";
  for (let i = 0; i < text.length; i += 2) {
    const pair = [charToNum(text[i]), charToNum(text[i + 1])];
    const c1 = (keyMatrix[0][0] * pair[0] + keyMatrix[0][1] * pair[1]) % 26;
    const c2 = (keyMatrix[1][0] * pair[0] + keyMatrix[1][1] * pair[1]) % 26;
    encrypted += numToChar(c1) + numToChar(c2);
  }
  return encrypted;
}

// Decrypt requires inverse matrix
const invKeyMatrix = [
  [15, 17],
  [20, 9],
];

export function hillDecrypt(text) {
  text = text.toUpperCase().replace(/[^A-Z]/g, "");
  let decrypted = "";
  for (let i = 0; i < text.length; i += 2) {
    const pair = [charToNum(text[i]), charToNum(text[i + 1])];
    const c1 = (invKeyMatrix[0][0] * pair[0] + invKeyMatrix[0][1] * pair[1]) % 26;
    const c2 = (invKeyMatrix[1][0] * pair[0] + invKeyMatrix[1][1] * pair[1]) % 26;
    decrypted += numToChar(c1) + numToChar(c2);
  }
  return decrypted;
}
