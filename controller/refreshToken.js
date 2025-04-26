import User from '../models/user';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export const refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ message: 'No header provided, User unauthorized' });
  } else {
    const token = authHeader.split(' ')[1];
    if (token) {
      const refreshToken = token;
      const foundUser = await User.findOne({ refreshToken: refreshToken })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return res.status(500).json({ message: 'Error while searching for a user Token', error: error });
        });

      if (foundUser) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
          if (error || foundUser.email !== decoded.email) {
            return res.status(403).json({ message: 'refreshtoken error', error: error });
          } else {
            const accessToken = jwt.sign(
              {
                email: decoded.email,
                userId: decoded.userId,
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: '1h',
              }
            );
            res.status(200).json({ accessToken });
          }
        });
      } else {
        res.status(403).json({ message: 'Access forbidden!, token invalid' });
      }
    }
  }
};
