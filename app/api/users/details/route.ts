import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/details
async function getSignedDetailsHandler(request:NextRequest) {
  return await userController.getSignedDetails(request);
}

export const GET = userAuth(getSignedDetailsHandler);