import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/settings
async function getVerifyHandler(request:NextRequest) {
  return await userController.verify(request);
}



export const GET = userAuth(getVerifyHandler);
