import { userAuth, adminAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/[id]
async function getUserByIdHandler(request: NextRequest, { params }: { params: { id: string } }) {
  const enhancedRequest = { ...request, params };
  return await userController.getUserById(enhancedRequest);
}

// DELETE /api/users/[id]
async function deleteUserHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await userController.deleteUser(enhancedRequest);
}

export const GET = userAuth(getUserByIdHandler);
export const DELETE = adminAuth(deleteUserHandler);