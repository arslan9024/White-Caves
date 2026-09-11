import express from 'express';
import mongoose from 'mongoose';
import Department from '../models/Department.js';
import AIAssistant from '../models/AIAssistant.js';
import Team from '../models/Team.js';
import Service from '../models/Service.js';
import Employee from '../models/Employee.js';
import { DEPARTMENTS_SEED, ASSISTANTS_SEED, TEAMS_SEED, SERVICES_SEED } from '../data/seedData.js';
import { EMPLOYEES_SEED } from '../data/employeesSeed.js';
import { SERVICES_SEED as SERVICES_FULL_SEED } from '../data/servicesSeed.js';

const router = express.Router();

router.post('/organization', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    console.log('Starting organization data seed...');
    
    await Department.deleteMany({}, { session });
    await AIAssistant.deleteMany({}, { session });
    await Team.deleteMany({}, { session });
    await Service.deleteMany({}, { session });
    console.log('Cleared existing data');

    const departmentMap = new Map();
    const departments = [];
    
    for (const dept of DEPARTMENTS_SEED) {
      const department = new Department(dept);
      await department.save({ session });
      departmentMap.set(dept.code, department._id);
      departments.push(department);
    }
    console.log(`Created ${departments.length} departments`);

    const assistantMap = new Map();
    const assistants = [];
    
    for (const asst of ASSISTANTS_SEED) {
      const departmentId = departmentMap.get(asst.departmentCode);
      if (!departmentId) {
        console.warn(`Department not found for assistant ${asst.name}: ${asst.departmentCode}`);
        continue;
      }
      
      const { departmentCode, ...assistantData } = asst;
      const assistant = new AIAssistant({
        ...assistantData,
        department: departmentId
      });
      await assistant.save({ session });
      assistantMap.set(asst.code, assistant._id);
      assistants.push(assistant);
    }
    console.log(`Created ${assistants.length} AI assistants`);

    const teams = [];
    for (const tm of TEAMS_SEED) {
      const departmentId = departmentMap.get(tm.departmentCode);
      if (!departmentId) {
        console.warn(`Department not found for team ${tm.name}: ${tm.departmentCode}`);
        continue;
      }
      
      const { departmentCode, ...teamData } = tm;
      const team = new Team({
        ...teamData,
        department: departmentId
      });
      await team.save({ session });
      teams.push(team);
    }
    console.log(`Created ${teams.length} teams`);

    const services = [];
    for (const svc of SERVICES_SEED) {
      const departmentId = departmentMap.get(svc.departmentCode);
      const assistantId = assistantMap.get(svc.assistantCode);
      
      if (!departmentId) {
        console.warn(`Department not found for service ${svc.name}: ${svc.departmentCode}`);
        continue;
      }
      
      const { departmentCode, assistantCode, ...serviceData } = svc;
      const service = new Service({
        ...serviceData,
        department: departmentId,
        aiAssistant: assistantId || null
      });
      await service.save({ session });
      services.push(service);
    }
    console.log(`Created ${services.length} services`);

    // 300% Acceleration Protocol: Pre-index relationships by department in O(n) using Maps
    const assistantsByDept = new Map();
    for (const a of assistants) {
      const dId = a.department.toString();
      if (!assistantsByDept.has(dId)) assistantsByDept.set(dId, []);
      assistantsByDept.get(dId).push(a._id);
    }

    const teamsByDept = new Map();
    for (const t of teams) {
      const dId = t.department.toString();
      if (!teamsByDept.has(dId)) teamsByDept.set(dId, []);
      teamsByDept.get(dId).push(t._id);
    }

    const servicesByDept = new Map();
    for (const s of services) {
      const dId = s.department.toString();
      if (!servicesByDept.has(dId)) servicesByDept.set(dId, []);
      servicesByDept.get(dId).push(s._id);
    }

    for (const dept of departments) {
      const deptIdStr = dept._id.toString();
      await Department.findByIdAndUpdate(
        dept._id,
        {
          assistants: assistantsByDept.get(deptIdStr) || [],
          teams: teamsByDept.get(deptIdStr) || [],
          services: servicesByDept.get(deptIdStr) || []
        },
        { session }
      );
    }
    console.log('Updated department relationships');

    await session.commitTransaction();
    
    res.json({
      success: true,
      message: 'Organization data seeded successfully',
      data: {
        departments: departments.length,
        assistants: assistants.length,
        teams: teams.length,
        services: services.length
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

router.get('/status', async (req, res) => {
  try {
    const [deptCount, assistantCount, teamCount, serviceCount, employeeCount] = await Promise.all([
      Department.countDocuments(),
      AIAssistant.countDocuments(),
      Team.countDocuments(),
      Service.countDocuments(),
      Employee.countDocuments()
    ]);
    
    res.json({
      success: true,
      data: {
        departments: deptCount,
        assistants: assistantCount,
        teams: teamCount,
        services: serviceCount,
        employees: employeeCount,
        hasData: deptCount > 0 && assistantCount > 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/full', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    console.log('Starting full organization data seed...');
    
    await Department.deleteMany({}, { session });
    await AIAssistant.deleteMany({}, { session });
    await Team.deleteMany({}, { session });
    await Service.deleteMany({}, { session });
    await Employee.deleteMany({}, { session });
    console.log('Cleared existing data');

    const departmentMap = new Map();
    const departments = [];
    
    for (const dept of DEPARTMENTS_SEED) {
      const department = new Department(dept);
      await department.save({ session });
      departmentMap.set(dept.code, department._id);
      departments.push(department);
    }
    console.log(`Created ${departments.length} departments`);

    const assistantMap = new Map();
    const assistants = [];
    
    for (const asst of ASSISTANTS_SEED) {
      const departmentId = departmentMap.get(asst.departmentCode);
      if (!departmentId) continue;
      
      const { departmentCode, ...assistantData } = asst;
      const assistant = new AIAssistant({
        ...assistantData,
        department: departmentId
      });
      await assistant.save({ session });
      assistantMap.set(asst.code, assistant._id);
      assistants.push(assistant);
    }
    console.log(`Created ${assistants.length} AI assistants`);

    const employeeMap = new Map();
    const employees = [];
    
    for (const emp of EMPLOYEES_SEED) {
      const departmentId = departmentMap.get(emp.departmentCode);
      if (!departmentId) continue;
      
      const { departmentCode, reportsTo, ...employeeData } = emp;
      const employee = new Employee({
        ...employeeData,
        department: departmentId
      });
      await employee.save({ session });
      employeeMap.set(emp.employeeId, employee._id);
      employees.push(employee);
    }
    
    for (const emp of EMPLOYEES_SEED) {
      if (emp.reportsTo && employeeMap.has(emp.reportsTo)) {
        await Employee.findOneAndUpdate(
          { employeeId: emp.employeeId },
          { reportsTo: employeeMap.get(emp.reportsTo) },
          { session }
        );
      }
    }
    console.log(`Created ${employees.length} employees`);

    const teams = [];
    for (const tm of TEAMS_SEED) {
      const departmentId = departmentMap.get(tm.departmentCode);
      if (!departmentId) continue;
      
      const { departmentCode, ...teamData } = tm;
      const team = new Team({
        ...teamData,
        department: departmentId
      });
      await team.save({ session });
      teams.push(team);
    }
    console.log(`Created ${teams.length} teams`);

    const services = [];
    for (const svc of SERVICES_FULL_SEED) {
      const departmentId = departmentMap.get(svc.departmentCode);
      if (!departmentId) continue;
      
      const { departmentCode, aiAssistants, ...serviceData } = svc;
      const service = new Service({
        ...serviceData,
        department: departmentId
      });
      await service.save({ session });
      services.push(service);
    }
    console.log(`Created ${services.length} services`);

    // 300% Acceleration Protocol: Pre-index relationships by department in O(n) using Maps
    const assistantsByDept2 = new Map();
    for (const a of assistants) {
      const dId = a.department.toString();
      if (!assistantsByDept2.has(dId)) assistantsByDept2.set(dId, []);
      assistantsByDept2.get(dId).push(a._id);
    }

    const teamsByDept2 = new Map();
    for (const t of teams) {
      const dId = t.department.toString();
      if (!teamsByDept2.has(dId)) teamsByDept2.set(dId, []);
      teamsByDept2.get(dId).push(t._id);
    }

    const servicesByDept2 = new Map();
    for (const s of services) {
      const dId = s.department.toString();
      if (!servicesByDept2.has(dId)) servicesByDept2.set(dId, []);
      servicesByDept2.get(dId).push(s._id);
    }

    for (const dept of departments) {
      const deptIdStr = dept._id.toString();
      await Department.findByIdAndUpdate(
        dept._id,
        {
          assistants: assistantsByDept2.get(deptIdStr) || [],
          teams: teamsByDept2.get(deptIdStr) || [],
          services: servicesByDept2.get(deptIdStr) || []
        },
        { session }
      );
    }
    console.log('Updated department relationships');

    await session.commitTransaction();
    
    res.json({
      success: true,
      message: 'Full organization data seeded successfully',
      data: {
        departments: departments.length,
        assistants: assistants.length,
        employees: employees.length,
        teams: teams.length,
        services: services.length
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Full seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
