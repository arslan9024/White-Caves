/**
 * Dubai Regulatory Mock Service Providers
 * Mocks responses from DLD (Dubai Land Department) and RERA APIs
 * for development and testing environments.
 */

export const DubaiRegulatorsMock = {
  verifyTitleDeed: async (titleDeedNumber: string) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation logic
    const isValid = titleDeedNumber.startsWith('DLD-') && titleDeedNumber.length > 8;
    
    return {
      success: true,
      verified: isValid,
      ownerMasked: isValid ? 'A*** M***' : null,
      propertyStatus: isValid ? 'Clear Title' : 'Invalid Deed',
      timestamp: new Date().toISOString()
    };
  },

  checkAgentReraLicense: async (reraBrn: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const isValid = reraBrn.length === 5 && !isNaN(Number(reraBrn));
    
    return {
      success: true,
      valid: isValid,
      status: isValid ? 'ACTIVE' : 'EXPIRED',
      expiryDate: isValid ? new Date(Date.now() + 31536000000).toISOString() : null, // +1 year
      brokerageName: isValid ? 'White Caves Real Estate LLC' : null
    };
  },

  registerEjariContract: async (contractDetails: any) => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      ejariNumber: `EJ-${Math.floor(Math.random() * 1000000)}`,
      status: 'REGISTERED',
      registrationFee: 220, // Standard AED 220 Ejari fee
      timestamp: new Date().toISOString()
    };
  }
};
