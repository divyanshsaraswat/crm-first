import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function addLogsHandler(request:NextRequest) {
  return await userController.addLogs(request);
}

export const POST = userAuth(addLogsHandler);