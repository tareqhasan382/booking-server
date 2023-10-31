import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import prisma from '../../../shared/prisma';
import { AuthService } from './auth.service';
import bcrypt = require('bcrypt');
const signup = catchAsync(async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 13);
    const data = {
      name: name,
      email: email,
      password: hashedPassword,
      role: req.body.role,
      contactNo: req.body.contactNo,
      address: req.body.address,
      profileImg: req.body.profileImg,
    };
    const result = await AuthService.signup(data);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'signup successfully !!',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'something went wrong',
      data: error,
    });
  }
});
const login = catchAsync(async (req: Request, res: Response) => {
  console.log('data: ', req.body);
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        success: true,
        message: 'User Does not exist !!',
      });
    }
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(httpStatus.NOT_FOUND).json({
          statusCode: httpStatus.NOT_FOUND,
          success: true,
          message: 'Invalid password !!',
        });
      }
    }
    //=====================================================//
    // const result = await AuthService.login(user);

    if (user) {
      const result = await AuthService.login(user);
      const cookieOptions = {
        secure: process.env.NODE_ENV == 'production', // config.env === 'production'
        httpOnly: true,
      };
      res.cookie('accessToken', result, cookieOptions);

      res.status(200).json({
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users login successfully !!',
        data: result,
      });
    }
    //console.log('result:', result);
  } catch (error) {
    res.status(400).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'something went wrong !!',
      data: error,
    });
  }
});

export const AuthControlller = {
  signup,
  login,
};
