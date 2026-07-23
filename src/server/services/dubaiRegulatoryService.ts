export interface EjariRegistrationResponse {
  success: boolean;
  ejariNumber: string;
  contractStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  issueDate: string;
  expiryDate: string;
}

export interface LegalNoticeResponse {
  success: boolean;
  noticeId: string;
  status: 'DELIVERED' | 'PENDING' | 'FAILED';
  deliveryMethod: 'NOTARY_PUBLIC' | 'REGISTERED_MAIL';
}

class DubaiRegulatoryService {
  /**
   * Mocks Ejari registration
   */
  async registerEjari(
    tenancyContractId: string,
    propertyId: string,
    tenantEmiratesId: string
  ): Promise<EjariRegistrationResponse> {
    console.log(`Mock Ejari Registration for Contract: ${tenancyContractId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          ejariNumber: `EJ-${Math.floor(Math.random() * 1000000)}`,
          contractStatus: 'ACTIVE',
          issueDate: new Date().toISOString(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        });
      }, 500);
    });
  }

  /**
   * Mocks Form 7 (Rent Notice / Rent Increase)
   */
  async sendForm7Notice(
    tenantId: string,
    propertyId: string,
    increasePercentage: number
  ): Promise<LegalNoticeResponse> {
    console.log(`Mock Form 7 (Rent Increase) for Tenant: ${tenantId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          noticeId: `F7-${Math.floor(Math.random() * 1000000)}`,
          status: 'DELIVERED',
          deliveryMethod: 'NOTARY_PUBLIC',
        });
      }, 500);
    });
  }

  /**
   * Mocks Form 12 (Eviction Notice)
   */
  async sendForm12Eviction(
    tenantId: string,
    propertyId: string,
    reason: string
  ): Promise<LegalNoticeResponse> {
    console.log(`Mock Form 12 (Eviction) for Tenant: ${tenantId}, Reason: ${reason}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          noticeId: `F12-${Math.floor(Math.random() * 1000000)}`,
          status: 'DELIVERED',
          deliveryMethod: 'NOTARY_PUBLIC',
        });
      }, 500);
    });
  }

  /**
   * Mocks Form 6 (Non-Renewal Notice)
   */
  async sendForm6NonRenewal(tenantId: string, propertyId: string): Promise<LegalNoticeResponse> {
    console.log(`Mock Form 6 (Non-Renewal) for Tenant: ${tenantId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          noticeId: `F6-${Math.floor(Math.random() * 1000000)}`,
          status: 'DELIVERED',
          deliveryMethod: 'REGISTERED_MAIL',
        });
      }, 500);
    });
  }
}

export const dubaiRegulatoryService = new DubaiRegulatoryService();
