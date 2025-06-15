import { userAuth, fuseAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getWhatsAppHandler(request: NextRequest) {
  return await userController.getUserWhatsApp(request);
}
async function updateWhatsAppHandler(request: NextRequest) {
  return await userController.updateUserWhatsapp(request);
}
export const GET = userAuth(getWhatsAppHandler);
export const PUT = userAuth(updateWhatsAppHandler);
