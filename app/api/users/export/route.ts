import { userAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function insertHandler(request:NextRequest) {
  return await userController.downloadCSV(request);
}

export const POST = userAuth(insertHandler);