import express from 'express';
import mongoose from 'mongoose';
import Department from '../models/Department.js';
import AIAssistant from '../models/AIAssistant.js';
import Team from '../models/Team.js';
import Service from '../models/Service.js';
import { DEPARTMENTS_SEED, ASSISTANTS_SEED, TEAMS_SEED, SERVICES_SEED } from '../data/seedData.js';

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

    for (const dept of departments) {
      const deptAssistants = assistants.filter(a => a.department.toString() === dept._id.toString());
      const deptTeams = teams.filter(t => t.department.toString() === dept._id.toString());
      const deptServices = services.filter(s => s.department.toString() === dept._id.toString());
      
      await Department.findByIdAndUpdate(
        dept._id,
        {
          assistants: deptAssistants.map(a => a._id),
          teams: deptTeams.map(t => t._id),
          services: deptServices.map(s => s._id)
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
    const [deptCount, assistantCount, teamCount, serviceCount] = await Promise.all([
      Department.countDocuments(),
      AIAssistant.countDocuments(),
      Team.countDocuments(),
      Service.countDocuments()
    ]);
    
    res.json({
      success: true,
      data: {
        departments: deptCount,
        assistants: assistantCount,
        teams: teamCount,
        services: serviceCount,
        hasData: deptCount > 0 && assistantCount > 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
