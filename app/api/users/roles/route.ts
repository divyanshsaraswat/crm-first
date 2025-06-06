import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/roles
async function getRolesHandler(request:NextRequest) {
  return await userController.getRoles(request);
}

export const GET = userAuth(getRolesHandler);