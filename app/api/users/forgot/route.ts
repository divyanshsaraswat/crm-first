import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/forgot
async function changePasswordHandler(request:NextRequest) {
  return await userController.changePassword(request);
}

export const POST = userAuth(changePasswordHandler);