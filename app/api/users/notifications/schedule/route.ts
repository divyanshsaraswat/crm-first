import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// DELETE /api/users/notifications/[id]
async function ScheduleNotificationHandler(request:NextRequest) {
  return await userController.scheduleNotification(request);
}

export const GET = userAuth(ScheduleNotificationHandler);