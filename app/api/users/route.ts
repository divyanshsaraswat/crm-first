import { userAuth, fuseAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getUsersHandler(request:NextRequest) {
  return await userController.getUsers(request);
}

// PUT /api/users
async function updateUserHandler(request:NextRequest) {
  return await userController.updateById(request);
}

export const GET = userAuth(getUsersHandler);
export const PUT = fuseAuth(updateUserHandler);