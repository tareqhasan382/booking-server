import { Secret } from 'jsonwebtoken';

import { Users } from '@prisma/client';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { ILoginUserResponse, IUser } from './auth.interface';
// import bcrypt = require('bcrypt');
const signup = async (data: IUser) => {
  console.log(data);
  const result = await prisma.users.create({ data });
  return result;
};
const login = async (payload: Users): Promise<ILoginUserResponse> => {
  const { id, role } = payload;
  //===============================create jwt token===================
  const accessToken = jwtHelpers.createToken(
    { id, role },
    process.env.secret as Secret,
    process.env.expires_in as string
  );
  return {
    accessToken,
  };
};

export const AuthService = {
  signup,
  login,
};
