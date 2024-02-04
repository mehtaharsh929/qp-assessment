const jwt = require('jsonwebtoken');
const db = require('../models');

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded,'decoded')
        const user = await db.User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error,"error")
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    // Check if the user has the 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access forbidden. Admin role required.');
    }
      next();
  };


  const isUser = (req, res, next) => {
    console.log(req.user.id);
    // Check if the user has the 'admin' role
    if (req.user.role !== 'user') {
      return res.status(403).send('Access forbidden. Users role required.');
    }
      next();
  };


module.exports = {authenticateJWT,isAdmin,isUser};
