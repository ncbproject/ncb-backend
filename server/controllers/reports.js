const { generateHindiReport } = require('../utils/reportGenerator');
const { Submission } = require('../models');

exports.generateDailyReport = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { date: req.params.date },
      include: ['Drugs', 'Arrests']
    });

    const reportData = submissions.map((sub, index) => ({
      sr_no: index + 1,
      date: sub.date.toLocaleDateString('en-IN'),
      zone: sub.zone,
      crime_no: sub.crime_no,
      agency: sub.joint_agency,
      place: sub.place,
      drugs: sub.Drugs.map(d => `${d.quantity} ${d.unit} ${d.name}`).join(', ')
    }));

    const pdfBuffer = await generateHindiReport(reportData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=daily-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};