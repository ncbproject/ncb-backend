const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { email, password, zone, role } = req.body;
    
    // Admin registration restriction
    if(role === 'admin' && !req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin creation restricted' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      zone,
      role: role || 'officer'
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, zone: user.zone },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};