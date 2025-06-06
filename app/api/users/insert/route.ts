import { fuseAuth } from '@/lib/services/utilities/attachJWT';
import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function insertHandler(request:NextRequest) {
  return await userController.insertUser(request);
}

export const POST = fuseAuth(insertHandler);