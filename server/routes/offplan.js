import express from 'express';
import OffPlanProject from '../models/OffPlanProject.js';
import OffPlanUnit from '../models/OffPlanUnit.js';

const router = express.Router();

router.get('/projects', async (req, res) => {
  try {
    const { 
      area, developer, status, constructionStatus,
      minPrice, maxPrice, bedrooms, propertyType,
      featured, page = 1, limit = 20, sort = '-createdAt'
    } = req.query;

    const filter = { status: 'active' };
    
    if (area) filter['location.area'] = { $regex: area, $options: 'i' };
    if (developer) filter.developer = { $regex: developer, $options: 'i' };
    if (constructionStatus) filter.constructionStatus = constructionStatus;
    if (featured === 'true') filter.featured = true;
    if (propertyType) filter.propertyTypes = propertyType;
    if (bedrooms) filter['bedrooms.min'] = { $lte: parseInt(bedrooms) };
    
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = {};
      if (minPrice) filter['priceRange.min'].$gte = parseInt(minPrice);
      if (maxPrice) filter['priceRange.max'] = { $lte: parseInt(maxPrice) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [projects, total] = await Promise.all([
      OffPlanProject.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      OffPlanProject.countDocuments(filter)
    ]);

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching off-plan projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const project = await OffPlanProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    project.views = (project.views || 0) + 1;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = new OffPlanProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await OffPlanProject.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/projects/:id/progress', async (req, res) => {
  try {
    const project = await OffPlanProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    project.constructionProgress.push({
      date: new Date(),
      ...req.body
    });
    
    project.currentProgress = req.body.percentage;
    
    if (req.body.percentage >= 100) {
      project.constructionStatus = 'completed';
    } else if (req.body.percentage >= 90) {
      project.constructionStatus = 'near-completion';
    }
    
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/projects/:projectId/units', async (req, res) => {
  try {
    const { status, propertyType, bedrooms, minPrice, maxPrice, floor } = req.query;
    
    const filter = { projectId: req.params.projectId };
    
    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (floor) filter.floor = parseInt(floor);
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    const units = await OffPlanUnit.find(filter).sort('unitNumber');
    
    const summary = {
      total: units.length,
      available: units.filter(u => u.status === 'available').length,
      reserved: units.filter(u => u.status === 'reserved').length,
      sold: units.filter(u => u.status === 'sold').length
    };
    
    res.json({ units, summary });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

router.get('/units/:id', async (req, res) => {
  try {
    const unit = await OffPlanUnit.findById(req.params.id)
      .populate('projectId', 'name developer location');
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

router.post('/units', async (req, res) => {
  try {
    const unit = new OffPlanUnit(req.body);
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    console.error('Error creating unit:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/units/:id', async (req, res) => {
  try {
    const unit = await OffPlanUnit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(unit);
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/units/:id/reserve', async (req, res) => {
  try {
    const unit = await OffPlanUnit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    
    if (unit.status !== 'available') {
      return res.status(400).json({ error: 'Unit is not available for reservation' });
    }
    
    unit.status = 'reserved';
    unit.reservationDate = new Date();
    unit.reservationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    unit.buyerName = req.body.buyerName;
    unit.buyerEmail = req.body.buyerEmail;
    unit.buyerPhone = req.body.buyerPhone;
    
    await unit.save();
    res.json(unit);
  } catch (error) {
    console.error('Error reserving unit:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [projectStats, unitStats] = await Promise.all([
      OffPlanProject.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$constructionStatus',
            count: { $sum: 1 },
            totalUnits: { $sum: '$totalUnits' },
            avgProgress: { $avg: '$currentProgress' }
          }
        }
      ]),
      OffPlanUnit.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$price' }
          }
        }
      ])
    ]);
    
    res.json({ projectStats, unitStats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
