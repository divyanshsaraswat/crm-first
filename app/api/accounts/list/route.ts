import { userAuth } from '@/lib/services/utilities/attachJWT';
import {accountController} from '@/lib/controllers/accountController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function getListHandler(request:NextRequest) {
  return await accountController.getAccountLists(request);
}

export const GET = userAuth(getListHandler);