import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/settings
async function getSettingsHandler(request:NextRequest) {
  return await userController.getSettings(request);
}

// PUT /api/users/settings
async function updateSettingsHandler(request:NextRequest) {
  return await userController.updateSettings(request);
}
async function insertSettingsHandler(request:NextRequest){
  return await userController.insertSettings(request);
}

export const GET = userAuth(getSettingsHandler);
export const POST = userAuth(insertSettingsHandler);
export const PUT = userAuth(updateSettingsHandler);
