import express from 'express';
import { SignatureToken, Contract } from '../lib/database.js';

const router = express.Router();

// Routes
router.get('/:token', async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      const tokens = req.app.locals.loadTokens();
      const tokenData = tokens[req.params.token];
      if (!tokenData) {
        return res.status(404).json({ success: false, error: 'Invalid signature link' });
      }
      if (tokenData.used) {
        return res.status(400).json({ success: false, error: 'This signature link has already been used' });
      }
      if (new Date(tokenData.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, error: 'This signature link has expired' });
      }

      const contracts = req.app.locals.loadContracts();
      const contract = contracts.find(c => c.id === tokenData.contractId);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }

      const safeContract = {
        id: contract.id,
        contractNumber: contract.contractNumber,
        ownerName: contract.ownerName,
        lessorName: contract.lessorName,
        tenantName: contract.tenantName,
        propertyUsage: contract.propertyUsage,
        buildingName: contract.buildingName,
        propertyType: contract.propertyType,
        location: contract.location,
        contractPeriodFrom: contract.contractPeriodFrom,
        contractPeriodTo: contract.contractPeriodTo,
        annualRent: contract.annualRent,
        securityDeposit: contract.securityDeposit,
        modeOfPayment: contract.modeOfPayment
      };

      res.json({
        success: true,
        contract: safeContract,
        role: tokenData.role,
        signerName: tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName
      });
      return;
    }

    const tokenData = await SignatureToken.findOne({ token: req.params.token });
    if (!tokenData) {
      return res.status(404).json({ success: false, error: 'Invalid signature link' });
    }
    if (tokenData.used) {
      return res.status(400).json({ success: false, error: 'This signature link has already been used' });
    }
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: 'This signature link has expired' });
    }

    const contract = await Contract.findById(tokenData.contractId);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }

    const safeContract = {
      id: contract._id,
      contractNumber: contract.contractNumber,
      ownerName: contract.ownerName,
      lessorName: contract.lessorName,
      tenantName: contract.tenantName,
      propertyUsage: contract.propertyUsage,
      buildingName: contract.buildingName,
      propertyType: contract.propertyType,
      location: contract.location,
      contractPeriodFrom: contract.contractPeriodFrom,
      contractPeriodTo: contract.contractPeriodTo,
      annualRent: contract.annualRent,
      securityDeposit: contract.securityDeposit,
      modeOfPayment: contract.modeOfPayment
    };

    res.json({
      success: true,
      contract: safeContract,
      role: tokenData.role,
      signerName: tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:token/sign', async (req, res) => {
  try {
    const { signature, signerName } = req.body;
    if (!signature) {
      return res.status(400).json({ success: false, error: 'Signature is required' });
    }

    if (!req.app.locals.useDatabase) {
      const tokens = req.app.locals.loadTokens();
      const tokenData = tokens[req.params.token];
      if (!tokenData) {
        return res.status(404).json({ success: false, error: 'Invalid signature link' });
      }
      if (tokenData.used) {
        return res.status(400).json({ success: false, error: 'This signature link has already been used' });
      }
      if (new Date(tokenData.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, error: 'This signature link has expired' });
      }

      const contracts = req.app.locals.loadContracts();
      const contractIndex = contracts.findIndex(c => c.id === tokenData.contractId);
      if (contractIndex === -1) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }

      contracts[contractIndex].signatures[tokenData.role] = {
        signature,
        signerName: signerName || (tokenData.role === 'lessor' ? contracts[contractIndex].lessorName : contracts[contractIndex].tenantName),
        signedAt: new Date().toISOString(),
        ipAddress: req.ip
      };

      const hasLessor = !!contracts[contractIndex].signatures.lessor;
      const hasTenant = !!contracts[contractIndex].signatures.tenant;
      contracts[contractIndex].status = (hasLessor && hasTenant) ? 'fully_signed' : 'partially_signed';
      contracts[contractIndex].updatedAt = new Date().toISOString();
      req.app.locals.saveContracts(contracts);

      tokens[req.params.token].used = true;
      tokens[req.params.token].usedAt = new Date().toISOString();
      req.app.locals.saveTokens(tokens);

      res.json({ success: true, message: 'Contract signed successfully', status: contracts[contractIndex].status });
      return;
    }

    const tokenData = await SignatureToken.findOne({ token: req.params.token });
    if (!tokenData) {
      return res.status(404).json({ success: false, error: 'Invalid signature link' });
    }
    if (tokenData.used) {
      return res.status(400).json({ success: false, error: 'This signature link has already been used' });
    }
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: 'This signature link has expired' });
    }

    const contract = await Contract.findById(tokenData.contractId);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }

    contract.signatures[tokenData.role] = {
      signature,
      signerName: signerName || (tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName),
      signedAt: new Date(),
      ipAddress: req.ip
    };

    const hasLessor = !!contract.signatures.lessor?.signature;
    const hasTenant = !!contract.signatures.tenant?.signature;
    contract.status = (hasLessor && hasTenant) ? 'fully_signed' : 'partially_signed';

    await contract.save();

    tokenData.used = true;
    tokenData.usedAt = new Date();
    await tokenData.save();

    res.json({ success: true, message: 'Contract signed successfully', status: contract.status });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
