import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/followup
async function getFollowupHandler(request:NextRequest) {
  return await userController.getFollowUp(request);
}
async function insertFollowUpHandler(request:NextRequest) {
  return await userController.insertUserFollowUp(request);
}

export const GET = userAuth(getFollowupHandler);
export const POST = userAuth(insertFollowUpHandler);