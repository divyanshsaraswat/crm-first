import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController}  from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// PATCH /api/users/notifications/[id]/read
async function markAsReadHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await userController.markAsRead(enhancedRequest);
}

export const PATCH = userAuth(markAsReadHandler);