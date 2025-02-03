const router = require('express').Router();
const { Submission, Drug, Arrest } = require('../models');
const auth = require('../middleware/auth');

// Create Submission
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const submission = await Submission.create({
      ...req.body,
      userId: req.user.id
    }, { transaction: t });

    const drugs = req.body.drugs.map(drug => ({
      ...drug,
      submissionId: submission.id
    }));
    await Drug.bulkCreate(drugs, { transaction: t });

    const arrests = req.body.arrests.map(arrest => ({
      ...arrest,
      submissionId: submission.id
    }));
    await Arrest.bulkCreate(arrests, { transaction: t });

    await t.commit();
    res.json(submission);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Get All Submissions (Admin Only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const submissions = await Submission.findAll({
      include: [Drug, Arrest],
      order: [['date', 'DESC']]
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});