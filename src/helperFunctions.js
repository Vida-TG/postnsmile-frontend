import CryptoJS from 'crypto-js';
import * as web3 from '@solana/web3.js';


export async function encryptKeypair(keypair) {
  const privateKeyString = keypair.secretKey.toString();
  const { encrypted, nonce, salt } = await implementEncrypt(privateKeyString)
  
  return ({encrypted, nonce, salt});
}

export function decryptKeypair(encrypted, nonce, salt) {
  const decryptedPrivateKey = implementDecrypt(encrypted, salt, nonce)
  const privateKeyBytes = Uint8Array.from(JSON.parse('['+decryptedPrivateKey+']'));
  return web3.Keypair.fromSecretKey(privateKeyBytes);
}


export const saveWallet = (
  encryptedPrivateKey,
  nonce,
  salt
  ) => {

  const data = JSON.stringify(
    {
      'encrypted': encryptedPrivateKey,
      'nonce': nonce,
      'salt': salt
    }
  )

  localStorage.setItem('data', data)
  return true;
};




export async function implementEncrypt(secretKey) {
    const nonce = CryptoJS.lib.WordArray.random(16);
    let salt = CryptoJS.lib.WordArray.random(16);
  
    const encrypted = CryptoJS.AES.encrypt(secretKey, salt, {
      iv: nonce,
    });

    return {
      encrypted: encrypted.toString(),
      nonce: nonce.toString(),
      salt: salt
    };
  }
  
  
  export function implementDecrypt(encryptedSecretKey, salt, nonce) {
    const decrypted = CryptoJS.AES.decrypt(encryptedSecretKey, salt, {
      iv: CryptoJS.enc.Hex.parse(nonce),
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  
  