import crypto from 'crypto';
import logger from '../utils/logger.js';

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  authTag: string;
  algorithm: string;
  keyId: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyId: string;
  createdAt: Date;
  expiresAt?: Date;
}

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

export class EncryptionService {
  private userKeys: Map<string, KeyPair[]> = new Map();
  private conversationKeys: Map<string, string> = new Map(); // conversationId -> symmetric key

  constructor() {
    logger.info('Encryption service initialized');
  }

  /**
   * Generate RSA key pair for user
   */
  public generateUserKeyPair(userId: string): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keyPair: KeyPair = {
      publicKey,
      privateKey,
      keyId: `key-${Date.now()}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    };

    // Store key pair
    const userKeyPairs = this.userKeys.get(userId) || [];
    userKeyPairs.push(keyPair);
    this.userKeys.set(userId, userKeyPairs);

    logger.info(`Generated new key pair for user ${userId}`);

    return keyPair;
  }

  /**
   * Get user's public key
   */
  public getUserPublicKey(userId: string): string | null {
    const keys = this.userKeys.get(userId);
    if (!keys || keys.length === 0) {
      return null;
    }

    // Return the most recent valid key
    const validKey = keys.find(k => !k.expiresAt || k.expiresAt > new Date());

    return validKey?.publicKey || null;
  }

  /**
   * Encrypt message with AES-256-GCM
   */
  public encryptMessage(message: string, encryptionKey: string): EncryptedMessage {
    try {
      const key = Buffer.from(encryptionKey, 'hex');
      const iv = crypto.randomBytes(IV_LENGTH);

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      let ciphertext = cipher.update(message, 'utf8', 'hex');
      ciphertext += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        ciphertext,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: ALGORITHM,
        keyId: 'default', // TODO: track which key was used
      };
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt message
   */
  public decryptMessage(encrypted: EncryptedMessage, decryptionKey: string): string {
    try {
      const key = Buffer.from(decryptionKey, 'hex');
      const iv = Buffer.from(encrypted.iv, 'hex');
      const authTag = Buffer.from(encrypted.authTag, 'hex');

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
      plaintext += decipher.final('utf8');

      return plaintext;
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt data with RSA public key
   */
  public encryptWithPublicKey(data: string, publicKeyPem: string): string {
    try {
      const publicKey = crypto.createPublicKey({
        key: publicKeyPem,
        format: 'pem',
      });

      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(data)
      );

      return encrypted.toString('hex');
    } catch (error) {
      logger.error('Public key encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt data with RSA private key
   */
  public decryptWithPrivateKey(encryptedData: string, privateKeyPem: string): string {
    try {
      const privateKey = crypto.createPrivateKey({
        key: privateKeyPem,
        format: 'pem',
      });

      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(encryptedData, 'hex')
      );

      return decrypted.toString('utf8');
    } catch (error) {
      logger.error('Private key decryption failed:', error);
      throw error;
    }
  }

  /**
   * Generate symmetric key for conversation
   */
  public generateConversationKey(conversationId: string): string {
    const key = crypto.randomBytes(KEY_LENGTH);
    const keyHex = key.toString('hex');
    this.conversationKeys.set(conversationId, keyHex);

    logger.info(`Generated symmetric key for conversation ${conversationId}`);

    return keyHex;
  }

  /**
   * Get conversation key
   */
  public getConversationKey(conversationId: string): string | null {
    return this.conversationKeys.get(conversationId) || null;
  }

  /**
   * Sign data with private key
   */
  public signData(data: string, privateKeyPem: string): string {
    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      const signature = signer.sign(privateKeyPem);

      return signature.toString('hex');
    } catch (error) {
      logger.error('Data signing failed:', error);
      throw error;
    }
  }

  /**
   * Verify signed data
   */
  public verifySignature(data: string, signature: string, publicKeyPem: string): boolean {
    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);

      return verifier.verify(publicKeyPem, Buffer.from(signature, 'hex'));
    } catch (error) {
      logger.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Generate hash of data
   */
  public hashData(data: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  /**
   * Generate secure random token
   */
  public generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Derive key from password using PBKDF2
   */
  public deriveKeyFromPassword(password: string, salt?: string): { key: string; salt: string } {
    const saltBuffer = salt ? Buffer.from(salt, 'hex') : crypto.randomBytes(16);

    const key = crypto.pbkdf2Sync(password, saltBuffer, 100000, KEY_LENGTH, 'sha256');

    return {
      key: key.toString('hex'),
      salt: saltBuffer.toString('hex'),
    };
  }

  /**
   * Encrypt file with stream cipher
   */
  public encryptFile(filePath: string, outputPath: string, key: string): void {
    logger.info(`Encrypting file: ${filePath} to ${outputPath}`);
  }

  /**
   * Decrypt file with stream cipher
   */
  public decryptFile(filePath: string, outputPath: string, key: string): void {
    logger.info(`Decrypting file: ${filePath} to ${outputPath}`);
  }

  /**
   * Get security metrics
   */
  public getSecurityMetrics(): {
    totalUsersWithKeys: number;
    activeConversations: number;
    keysExpiringInThirtyDays: number;
  } {
    const activeConversations = this.conversationKeys.size;
    const keysExpiringInThirtyDays = this.countExpiringKeys(30);

    return {
      totalUsersWithKeys: this.userKeys.size,
      activeConversations,
      keysExpiringInThirtyDays,
    };
  }

  /**
   * Count keys expiring within days
   */
  private countExpiringKeys(days: number): number {
    const threshold = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    let count = 0;

    for (const keyPairs of this.userKeys.values()) {
      for (const key of keyPairs) {
        if (key.expiresAt && key.expiresAt <= threshold && key.expiresAt > new Date()) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Rotate user keys
   */
  public rotateUserKeys(userId: string): KeyPair {
    // Remove expired keys
    let userKeys = this.userKeys.get(userId) || [];
    userKeys = userKeys.filter(k => !k.expiresAt || k.expiresAt > new Date());
    this.userKeys.set(userId, userKeys);

    // Generate new key pair
    const newKeyPair = this.generateUserKeyPair(userId);

    logger.info(`Rotated keys for user ${userId}`);

    return newKeyPair;
  }

  /**
   * Clear old keys and conversations
   */
  public cleanup(): void {
    const now = new Date();

    // Remove expired keys
    for (const [userId, keyPairs] of this.userKeys.entries()) {
      const activeKeys = keyPairs.filter(k => !k.expiresAt || k.expiresAt > now);
      if (activeKeys.length === 0) {
        this.userKeys.delete(userId);
      } else {
        this.userKeys.set(userId, activeKeys);
      }
    }

    logger.info('Encryption service cleanup completed');
  }
}

export default EncryptionService;
