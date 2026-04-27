/**
 * Currency Routes — /api/currency
 *
 * Public endpoints for exchange rates and conversion.
 * No authentication required (rates are public data).
 */

import { Router, Request, Response } from 'express';
import {
  getExchangeRates,
  getSupportedCurrencies,
  convert,
  convertToAED,
  formatWithAedEquivalent,
  isSupportedCurrency,
  type SupportedCurrency,
} from '../services/currencyService.js';

const router = Router();

/**
 * GET /api/currency/rates
 * Returns current exchange rates (base: AED)
 */
router.get('/rates', (_req: Request, res: Response) => {
  try {
    const rates = getExchangeRates();
    res.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch exchange rates' });
  }
});

/**
 * GET /api/currency/supported
 * Returns list of supported currencies with metadata
 */
router.get('/supported', (_req: Request, res: Response) => {
  try {
    const currencies = getSupportedCurrencies();
    res.json({
      success: true,
      data: currencies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch currencies' });
  }
});

/**
 * GET /api/currency/convert?amount=1000&from=USD&to=AED
 * Convert between currencies
 */
router.get('/convert', (req: Request, res: Response) => {
  try {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
      res.status(400).json({
        success: false,
        error: 'Missing required params: amount, from, to',
      });
      return;
    }

    const numAmount = parseFloat(amount as string);
    if (isNaN(numAmount)) {
      res.status(400).json({ success: false, error: 'Invalid amount' });
      return;
    }

    const fromCurrency = (from as string).toUpperCase();
    const toCurrency = (to as string).toUpperCase();

    if (!isSupportedCurrency(fromCurrency) || !isSupportedCurrency(toCurrency)) {
      res.status(400).json({
        success: false,
        error: `Unsupported currency. Supported: AED, USD, EUR, GBP, INR`,
      });
      return;
    }

    const converted = convert(numAmount, fromCurrency, toCurrency);
    const rates = getExchangeRates();

    res.json({
      success: true,
      data: {
        original: { amount: numAmount, currency: fromCurrency },
        converted: { amount: converted, currency: toCurrency },
        rate: rates.rates[fromCurrency],
        rateSource: rates.source,
        rateUpdatedAt: rates.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Conversion failed' });
  }
});

/**
 * GET /api/currency/to-aed?amount=500000&currency=USD
 * Shortcut: convert any currency to AED
 */
router.get('/to-aed', (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.query;

    if (!amount || !currency) {
      res.status(400).json({
        success: false,
        error: 'Missing required params: amount, currency',
      });
      return;
    }

    const numAmount = parseFloat(amount as string);
    if (isNaN(numAmount)) {
      res.status(400).json({ success: false, error: 'Invalid amount' });
      return;
    }

    const curr = (currency as string).toUpperCase();
    if (!isSupportedCurrency(curr)) {
      res.status(400).json({
        success: false,
        error: `Unsupported currency. Supported: AED, USD, EUR, GBP, INR`,
      });
      return;
    }

    const aedAmount = convertToAED(numAmount, curr);
    const display = formatWithAedEquivalent(numAmount, curr);

    res.json({
      success: true,
      data: {
        original: { amount: numAmount, currency: curr },
        aedAmount,
        display,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Conversion failed' });
  }
});

export default router;
