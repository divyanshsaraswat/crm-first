import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/settings
async function getMailHandler(request:NextRequest) {
  return await userController.sendMail(request);
}



export const GET = userAuth(getMailHandler);
