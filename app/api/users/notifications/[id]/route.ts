import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// DELETE /api/users/notifications/[id]
async function deleteNotificationHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await userController.deleteNotification(enhancedRequest);
}

export const DELETE = userAuth(deleteNotificationHandler);