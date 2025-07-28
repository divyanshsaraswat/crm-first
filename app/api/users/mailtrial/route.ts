import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function insertHandler(request:NextRequest) {
  return await userController.sendTrialMail(request);
}

export const POST = insertHandler;