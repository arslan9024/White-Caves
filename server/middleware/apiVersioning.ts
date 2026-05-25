import { NextFunction, Request, Response } from 'express';

export const API_PREFIX = '/api';
export const API_V1_PREFIX = '/api/v1';
export const API_LEGACY_SUNSET = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString();

export const rewriteV1ToLegacyApi = (req: Request, _res: Response, next: NextFunction): void => {
  req.url = `${API_PREFIX}${req.url}`;
  next();
};

export const markLegacyApiDeprecated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.originalUrl.startsWith(`${API_V1_PREFIX}/`)) {
    const successorPath = req.path.startsWith('/') ? req.path : `/${req.path}`;
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', API_LEGACY_SUNSET);
    res.setHeader('Link', `<${API_V1_PREFIX}${successorPath}>; rel="successor-version"`);
  }
  next();
};
