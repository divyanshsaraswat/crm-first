import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// GET /api/users/notifications
async function getAllNotificationsHandler(request:NextRequest) {
  return await userController.getAllNotifications(request);
}

// POST /api/users/notifications
async function createNotificationHandler(request:NextRequest) {
  return await userController.createNotification(request);
}

export const GET = userAuth(getAllNotificationsHandler);
export const POST = userAuth(createNotificationHandler);