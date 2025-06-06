import { userAuth } from '@/lib/services/utilities/attachJWT';
import {accountController} from '@/lib/controllers/accountController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function insertHandler(request:NextRequest) {
  return await accountController.insertAccount(request);
}

export const POST = userAuth(insertHandler);