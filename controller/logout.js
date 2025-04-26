import User from '../models/user';

export const logOutUser = async (req, res) => {
  const authHeader = req.headers.refresh;
  const mail = req.email;

  if (authHeader) {
    const refreshToken = authHeader.split(' ')[1];
    const foundUser = await User.findOne({ email: mail })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return res.status(500).json({ message: 'Error while searching for a user Token', error: error });
      });

    if (foundUser) {
      await User.findByIdAndUpdate(
        { _id: foundUser._id },
        { token: 'loggedOut' },
        {
          new: true,
          upsert: true, // Make this update into an upsert
        }
      )
        .then((response) => {
          res.status(200).json({ message: 'Cleared' });
        })
        .catch((error) => {
          res.status(500).json({ message: 'Error while updating the token', error: error });
        });
    } else {
      res.clearCookie('jwt', { httpOnly: true });
      res.status(200).json({ message: 'Cleared , no user found on that Cookie' });
    }
  } else {
    return res.status(200).json({ message: 'Header not included, Successfull' });
  }
};
