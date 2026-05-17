import express from 'express';
import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import Lead from '../models/Lead.js';
import InventoryProperty from '../models/InventoryProperty.js';
import TenancyDeal from '../models/TenancyDeal.js';
import SalesDeal from '../models/SalesDeal.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import {
  EMPLOYEES_DEMO,
  USERS_DEMO,
  PROPERTIES_DEMO,
  LEADS_DEMO,
  TENANCY_DEALS_DEMO,
  SALES_DEALS_DEMO,
  SERVICES_CATALOG
} from '../data/comprehensiveSeed.js';

const router = express.Router();

const DEPARTMENT_CODE_MAP = {
  'executive': 'EXEC',
  'sales': 'SALES',
  'leasing': 'LEASING',
  'property_management': 'PROP_MGMT',
  'marketing': 'MARKETING',
  'finance': 'FINANCE',
  'legal': 'LEGAL',
  'hr': 'HR',
  'technology': 'TECH',
  'operations': 'OPS'
};

router.post('/all', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    console.log('🚀 Starting comprehensive data seed...');
    const results = {
      employees: 0,
      users: 0,
      properties: 0,
      leads: 0,
      tenancyDeals: 0,
      salesDeals: 0
    };
    
    const departments = await Department.find({});
    const deptMap = new Map();
    departments.forEach(d => {
      deptMap.set(d.code, d._id);
      Object.entries(DEPARTMENT_CODE_MAP).forEach(([key, code]) => {
        if (d.code === code) deptMap.set(key, d._id);
      });
    });
    
    console.log('📝 Seeding employees...');
    await Employee.deleteMany({}, { session });
    for (const emp of EMPLOYEES_DEMO) {
      const deptId = deptMap.get(emp.department) || deptMap.get(DEPARTMENT_CODE_MAP[emp.department]);
      const employee = new Employee({
        ...emp,
        department: deptId || null,
        employment: { type: 'full-time', status: 'active', hireDate: new Date('2023-01-15') },
        contact: { phone: '+97144567890', mobile: '+971501234567' },
        photo: `/avatars/${emp.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
      });
      await employee.save({ session });
      results.employees++;
    }
    console.log(`✅ Created ${results.employees} employees`);
    
    console.log('👥 Seeding users...');
    await User.deleteMany({}, { session });
    for (const user of USERS_DEMO) {
      const newUser = new User({
        ...user,
        kycStatus: user.role === 'tenant' || user.role === 'buyer' ? 'pending' : 'verified',
        lastActivity: new Date()
      });
      await newUser.save({ session });
      results.users++;
    }
    console.log(`✅ Created ${results.users} users`);
    
    console.log('🏠 Seeding properties...');
    await InventoryProperty.deleteMany({}, { session });
    for (const prop of PROPERTIES_DEMO) {
      const property = new InventoryProperty({
        ...prop,
        currency: 'AED',
        source: 'manual',
        isActive: true,
        createdBy: 'system'
      });
      await property.save({ session });
      results.properties++;
    }
    console.log(`✅ Created ${results.properties} properties`);
    
    console.log('📊 Seeding leads...');
    await Lead.deleteMany({}, { session });
    for (const lead of LEADS_DEMO) {
      const newLead = new Lead({
        ...lead,
        lastContactDate: lead.status !== 'new' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        nextFollowUp: lead.status !== 'converted' && lead.status !== 'lost' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
      });
      await newLead.save({ session });
      results.leads++;
    }
    console.log(`✅ Created ${results.leads} leads`);
    
    console.log('📋 Seeding tenancy deals...');
    await TenancyDeal.deleteMany({}, { session });
    for (const dealData of TENANCY_DEALS_DEMO) {
      const timeline = [{
        stage: 'inquiry',
        status: 'completed',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        actor: 'System',
        notes: 'Lead received'
      }];
      
      const statusOrder = ['inquiry', 'viewing_scheduled', 'viewing_completed', 'offer_submitted', 'landlord_review', 'offer_accepted', 'contract_preparation', 'pending_signatures', 'signed', 'ejari_submitted', 'ejari_registered'];
      const currentIndex = statusOrder.indexOf(dealData.status);
      
      for (let i = 1; i <= currentIndex; i++) {
        timeline.push({
          stage: statusOrder[i],
          status: i < currentIndex ? 'completed' : 'in_progress',
          timestamp: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000),
          actor: dealData.broker?.name || 'System'
        });
      }
      
      const tenancyDeal = new TenancyDeal({
        dealNumber: dealData.dealNumber,
        status: dealData.status,
        property: {
          address: dealData.property?.address,
          area: dealData.property?.area,
          propertyType: dealData.property?.type,
          bedrooms: dealData.property?.bedrooms,
          bathrooms: dealData.property?.bathrooms,
          size: dealData.property?.size,
          annualRent: dealData.property?.annualRent,
          securityDeposit: dealData.property?.securityDeposit
        },
        landlord: {
          name: dealData.landlord?.name,
          email: dealData.landlord?.email,
          phone: dealData.landlord?.phone,
          landlordType: dealData.landlord?.type || 'individual'
        },
        tenant: {
          name: dealData.tenant?.name,
          email: dealData.tenant?.email,
          phone: dealData.tenant?.phone,
          employer: dealData.tenant?.employer,
          monthlyIncome: dealData.tenant?.monthlyIncome,
          kycStatus: dealData.tenant?.kycStatus || 'pending'
        },
        broker: {
          name: dealData.broker?.name,
          brnNumber: dealData.broker?.brnNumber,
          assignedBy: dealData.broker?.assignedBy || 'System'
        },
        offer: dealData.offer ? {
          monthlyRent: dealData.offer.monthlyRent,
          securityDeposit: dealData.offer.securityDeposit,
          agencyFee: dealData.offer.agencyFee,
          paymentSchedule: dealData.offer.paymentSchedule,
          startDate: dealData.offer.startDate,
          endDate: dealData.offer.endDate,
          duration: dealData.offer.duration || 12
        } : undefined,
        ejari: dealData.ejari ? {
          ejariNumber: dealData.ejari.ejariNumber,
          registeredAt: dealData.ejari.registeredAt
        } : undefined,
        timeline
      });
      await tenancyDeal.save({ session });
      results.tenancyDeals++;
    }
    console.log(`✅ Created ${results.tenancyDeals} tenancy deals`);
    
    console.log('💰 Seeding sales deals...');
    await SalesDeal.deleteMany({}, { session });
    for (const dealData of SALES_DEALS_DEMO) {
      const timeline = [{
        stage: 'lead',
        status: 'completed',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        actor: 'System',
        notes: 'Lead captured'
      }];
      
      const statusOrder = ['lead', 'qualified', 'viewing_scheduled', 'viewing_completed', 'offer_submitted', 'negotiation', 'offer_accepted', 'spa_preparation', 'spa_signed', 'noc_applied', 'noc_received', 'dld_transfer', 'completed'];
      const currentIndex = statusOrder.indexOf(dealData.status);
      
      for (let i = 1; i <= currentIndex; i++) {
        timeline.push({
          stage: statusOrder[i],
          status: i < currentIndex ? 'completed' : 'in_progress',
          timestamp: new Date(Date.now() - (30 - i * 2) * 24 * 60 * 60 * 1000),
          actor: dealData.broker?.name || 'System'
        });
      }
      
      const salesDeal = new SalesDeal({
        dealNumber: dealData.dealNumber,
        dealType: dealData.dealType,
        status: dealData.status,
        property: {
          address: dealData.property?.address,
          area: dealData.property?.area,
          project: dealData.property?.project,
          developer: dealData.property?.developer,
          propertyType: dealData.property?.type,
          bedrooms: dealData.property?.bedrooms,
          bathrooms: dealData.property?.bathrooms,
          size: dealData.property?.size,
          askingPrice: dealData.property?.askingPrice,
          isOffPlan: dealData.property?.isOffPlan || false
        },
        seller: {
          name: dealData.seller?.name,
          email: dealData.seller?.email,
          phone: dealData.seller?.phone,
          sellerType: dealData.seller?.type || 'individual'
        },
        buyer: {
          name: dealData.buyer?.name,
          email: dealData.buyer?.email,
          phone: dealData.buyer?.phone,
          nationality: dealData.buyer?.nationality,
          kycStatus: dealData.buyer?.kycStatus || 'pending'
        },
        broker: {
          name: dealData.broker?.name,
          brnNumber: dealData.broker?.brnNumber,
          specialization: dealData.broker?.specialization || 'both',
          assignedBy: dealData.broker?.assignedBy || 'System'
        },
        leadSource: dealData.leadSource ? {
          source: dealData.leadSource.source,
          leadScore: dealData.leadSource.leadScore,
          qualification: dealData.leadSource.qualification
        } : undefined,
        offer: dealData.offer ? {
          offerPrice: dealData.offer.offerPrice,
          counterPrice: dealData.offer.counterPrice,
          agreedPrice: dealData.offer.agreedPrice,
          depositAmount: dealData.offer.depositAmount,
          paymentPlan: dealData.offer.paymentPlan,
          submittedAt: dealData.offer.submittedAt,
          validUntil: dealData.offer.validUntil
        } : undefined,
        spa: dealData.spa ? {
          spaNumber: dealData.spa.spaNumber,
          generatedAt: dealData.spa.generatedAt,
          sellerSignedAt: dealData.spa.sellerSignedAt,
          buyerSignedAt: dealData.spa.buyerSignedAt
        } : undefined,
        noc: dealData.noc ? {
          nocNumber: dealData.noc.nocNumber,
          appliedAt: dealData.noc.appliedAt,
          developerName: dealData.noc.developerName
        } : undefined,
        dld: dealData.dld ? {
          dldTransactionNumber: dealData.dld.dldTransactionNumber,
          transferDate: dealData.dld.transferDate,
          titleDeedNumber: dealData.dld.titleDeedNumber,
          registrationFee: dealData.dld.registrationFee,
          transferFee: dealData.dld.transferFee,
          completedAt: dealData.dld.completedAt
        } : undefined,
        timeline
      });
      await salesDeal.save({ session });
      results.salesDeals++;
    }
    console.log(`✅ Created ${results.salesDeals} sales deals`);
    
    await session.commitTransaction();
    
    console.log('🎉 Comprehensive seed completed successfully!');
    
    res.json({
      success: true,
      message: 'Comprehensive data seeded successfully',
      data: results
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [employees, users, properties, leads, tenancyDeals, salesDeals] = await Promise.all([
      Employee.countDocuments(),
      User.countDocuments(),
      InventoryProperty.countDocuments(),
      Lead.countDocuments(),
      TenancyDeal.countDocuments(),
      SalesDeal.countDocuments()
    ]);
    
    const leadsByStatus = await Lead.getLeadsByStatus();
    const leadsBySource = await Lead.getLeadsBySource();
    
    const propertyStats = await InventoryProperty.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$askingPrice' }
      }}
    ]);
    
    const dealStats = {
      tenancy: await TenancyDeal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      sales: await SalesDeal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    };
    
    res.json({
      success: true,
      data: {
        counts: { employees, users, properties, leads, tenancyDeals, salesDeals },
        leadsByStatus,
        leadsBySource,
        propertyStats,
        dealStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    const [employees, users, properties, leads, tenancyDeals, salesDeals] = await Promise.all([
      Employee.deleteMany({}),
      User.deleteMany({}),
      InventoryProperty.deleteMany({}),
      Lead.deleteMany({}),
      TenancyDeal.deleteMany({}),
      SalesDeal.deleteMany({})
    ]);
    
    res.json({
      success: true,
      message: 'All demo data cleared',
      deleted: {
        employees: employees.deletedCount,
        users: users.deletedCount,
        properties: properties.deletedCount,
        leads: leads.deletedCount,
        tenancyDeals: tenancyDeals.deletedCount,
        salesDeals: salesDeals.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
