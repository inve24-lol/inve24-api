export abstract class IMailCacheRepository {
  abstract setCertCode(email: string, certCode: number, ttl: number): Promise<string>;
  abstract getCertCode(email: string): Promise<string | null>;
  abstract delCertCode(email: string): Promise<void>;
}
