/**
 * Department Query Controller
 * Handlers for departmental metadata, aggregated metrics, KPI lists, trends, and summaries.
 */

import { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler.js';
import { RouteRequest, DEPARTMENTS, routeParamToString } from './departmentCommon.js';
import { getDepartmentData } from './departmentAggregationService.js';

export const getDepartments = async (_req: RouteRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    departments: DEPARTMENTS,
  });
};

export const getDepartmentDataByCode = async (req: Request, res: Response): Promise<void> => {
  const codeParam = routeParamToString(req.params.code);
  if (!codeParam) {
    throw new AppError('Department code is required', 400);
  }
  const code = codeParam.toUpperCase();

  const data = await getDepartmentData(code);
  if (!data) {
    res.status(404).json({ success: false, error: `Department '${code}' not found` });
    return;
  }

  res.status(200).json({ success: true, data });
};

export const getDepartmentKpis = async (req: Request, res: Response): Promise<void> => {
  const codeParam = routeParamToString(req.params.code);
  if (!codeParam) {
    throw new AppError('Department code is required', 400);
  }
  const code = codeParam.toUpperCase();

  const data = await getDepartmentData(code);
  if (!data) {
    res.status(404).json({ success: false, error: `Department '${code}' not found` });
    return;
  }

  res.status(200).json({
    success: true,
    kpis: (data as { kpis: unknown[] }).kpis,
    pagination: { page: 1, pageSize: 20, total: (data as { kpis: unknown[] }).kpis.length },
  });
};

export const getDepartmentTrends = async (req: Request, res: Response): Promise<void> => {
  const codeParam = routeParamToString(req.params.code);
  if (!codeParam) {
    throw new AppError('Department code is required', 400);
  }
  const code = codeParam.toUpperCase();

  const data = await getDepartmentData(code);
  if (!data) {
    res.status(404).json({ success: false, error: `Department '${code}' not found` });
    return;
  }

  res.status(200).json({
    success: true,
    trends: (data as { trends: unknown[] }).trends,
    period: req.query.period || 'monthly',
  });
};

export const getDepartmentSummary = async (req: Request, res: Response): Promise<void> => {
  const codeParam = routeParamToString(req.params.code);
  if (!codeParam) {
    throw new AppError('Department code is required', 400);
  }
  const code = codeParam.toUpperCase();

  const data = await getDepartmentData(code);
  if (!data) {
    res.status(404).json({ success: false, error: `Department '${code}' not found` });
    return;
  }

  res.status(200).json({
    success: true,
    summary: (data as { summary: unknown }).summary,
  });
};

