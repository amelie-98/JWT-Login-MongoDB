import jwt from 'jsonwebtoken';

import User from '../models/user';

require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

const getSignedToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    secret_key,
    {
      expiresIn: '1h',
    },
  );

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user)
    return res.status(403).json({
      error: {
        message: 'Email already in use!',
      },
    });

  const newUser = new User({ firstName, lastName, email, password });

  try {
    await newUser.save();

    const token = getSignedToken(newUser);

    res.status(200).json({
      token: token,
      message: 'register success',
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //so sánh passoword so với hash Passoword
  const isValid = !!user ? await user.isPasswordValid(password) : null;

  if (!isValid)
    return res.status(403).json({
      error: {
        message: 'invalid email/password',
      },
    });

  const token = getSignedToken(user);

  res.status(200).json({
    token: token,
    message: 'login success',
  });
};
