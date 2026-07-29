import express from 'express';
import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import Lead from '../models/Lead.js';
import InventoryProperty from '../models/InventoryProperty.js';
import TenancyDeal from '../models/TenancyDeal.js';
import SalesDeal from '../models/SalesDeal.js';
import User from '../models/User.js';
import Service from '../models/Service.js';

const router = express.Router();

router.get('/properties', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      area, 
      propertyType, 
      purpose,
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      featured,
      search
    } = req.query;
    
    const query = { isActive: true };
    
    if (status) query.status = status;
    if (area) query.area = { $regex: area, $options: 'i' };
    if (propertyType) query.propertyType = propertyType;
    if (purpose) query.purpose = purpose;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.askingPrice = {};
      if (minPrice) query.askingPrice.$gte = Number(minPrice);
      if (maxPrice) query.askingPrice.$lte = Number(maxPrice);
    }
    if (minRooms || maxRooms) {
      query.rooms = {};
      if (minRooms) query.rooms.$gte = Number(minRooms);
      if (maxRooms) query.rooms.$lte = Number(maxRooms);
    }
    if (search) {
      query.$or = [
        { area: { $regex: search, $options: 'i' } },
        { project: { $regex: search, $options: 'i' } },
        { pNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [properties, total] = await Promise.all([
      InventoryProperty.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InventoryProperty.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/properties/featured', async (req, res) => {
  try {
    const properties = await InventoryProperty.find({ featured: true, isActive: true })
      .sort({ askingPrice: -1 })
      .limit(12);
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/properties/stats', async (req, res) => {
  try {
    const [byStatus, byArea, byType, total] = await Promise.all([
      InventoryProperty.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      InventoryProperty.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$area', count: { $sum: 1 }, avgPrice: { $avg: '$askingPrice' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      InventoryProperty.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$propertyType', count: { $sum: 1 } } }
      ]),
      InventoryProperty.countDocuments({ isActive: true })
    ]);
    
    res.json({ success: true, data: { byStatus, byArea, byType, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findById(req.params.id).populate('owners primaryOwner');
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    await InventoryProperty.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    // Schema validation enforced for payload
    const property = new InventoryProperty({
      ...req.body,
      source: 'manual',
      isActive: true
    });
    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: 'system' },
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, kycStatus, search } = req.query;
    
    const query = { isActive: true };
    if (role) query.role = role;
    if (kycStatus) query.kycStatus = kycStatus;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users/stats', async (req, res) => {
  try {
    const roleStats = await User.getRoleStats();
    const kycStats = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$kycStatus', count: { $sum: 1 } } }
    ]);
    const total = await User.countDocuments({ isActive: true });
    
    res.json({ success: true, data: { roleStats, kycStats, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/leads', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, source, stage, minScore, search } = req.query;
    
    const query = { isActive: true };
    if (status) query.status = status;
    if (source) query.source = source;
    if (stage) query.stage = stage;
    if (minScore) query.score = { $gte: Number(minScore) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ score: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lead.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: leads,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/leads/stats', async (req, res) => {
  try {
    const [byStatus, bySource, byStage, avgScore, total] = await Promise.all([
      Lead.getLeadsByStatus(),
      Lead.getLeadsBySource(),
      Lead.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$stage', count: { $sum: 1 } } }
      ]),
      Lead.getAverageScore(),
      Lead.countDocuments({ isActive: true })
    ]);
    
    const conversionRate = await Lead.getConversionRate();
    
    res.json({ success: true, data: { byStatus, bySource, byStage, avgScore: avgScore[0]?.avgScore || 0, conversionRate, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('propertyInterest');
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/leads/:id/interaction', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    
    lead.interactions.push({
      ...req.body,
      date: new Date()
    });
    lead.lastContactDate = new Date();
    await lead.save();
    
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const { page = 1, limit = 50, department, level, status, search } = req.query;
    
    const query = {};
    if (department) query.department = department;
    if (level) query.level = level;
    if (status) query['employment.status'] = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [employees, total] = await Promise.all([
      Employee.find(query).populate('department').sort({ order: 1, name: 1 }).skip(skip).limit(Number(limit)),
      Employee.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: employees,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/employees/stats', async (req, res) => {
  try {
    const [byDepartment, byLevel, total] = await Promise.all([
      Employee.aggregate([
        { $match: { 'employment.status': 'active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]),
      Employee.aggregate([
        { $match: { 'employment.status': 'active' } },
        { $group: { _id: '$level', count: { $sum: 1 } } }
      ]),
      Employee.countDocuments({ 'employment.status': 'active' })
    ]);
    
    res.json({ success: true, data: { byDepartment, byLevel, total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department reportsTo');
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 'employment.status': 'terminated', 'employment.terminationDate': new Date() },
      { new: true }
    );
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: 'Employee terminated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services', async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    const services = await Service.find(query).populate('department aiAssistant').sort({ category: 1, name: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('department aiAssistant');
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dashboard/overview', async (req, res) => {
  try {
    const [
      totalProperties,
      availableProperties,
      totalLeads,
      hotLeads,
      totalUsers,
      activeTenancies,
      activeSales,
      totalEmployees
    ] = await Promise.all([
      InventoryProperty.countDocuments({ isActive: true }),
      InventoryProperty.countDocuments({ isActive: true, status: 'available' }),
      Lead.countDocuments({ isActive: true }),
      Lead.countDocuments({ isActive: true, score: { $gte: 80 } }),
      User.countDocuments({ isActive: true }),
      TenancyDeal.countDocuments({ status: { $nin: ['completed', 'cancelled'] } }),
      SalesDeal.countDocuments({ status: { $nin: ['completed', 'cancelled'] } }),
      Employee.countDocuments({ 'employment.status': 'active' })
    ]);
    
    const propertyValue = await InventoryProperty.aggregate([
      { $match: { isActive: true, status: 'available' } },
      { $group: { _id: null, total: { $sum: '$askingPrice' } } }
    ]);
    
    const recentLeads = await Lead.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email status score source createdAt');
    
    const recentProperties = await InventoryProperty.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('pNumber area project propertyType status askingPrice');
    
    res.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          availableProperties,
          totalLeads,
          hotLeads,
          totalUsers,
          activeTenancies,
          activeSales,
          totalEmployees,
          portfolioValue: propertyValue[0]?.total || 0
        },
        recentLeads,
        recentProperties
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
