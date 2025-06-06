import { userAuth } from '@/lib/services/utilities/attachJWT';
import {accountController} from '@/lib/controllers/accountController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getAccountHandler(request:NextRequest) {
  return await accountController.getAccounts(request);
}
async function updateAccountHandler(request:NextRequest) {
  return await accountController.updateById(request);
}



export const GET = userAuth(getAccountHandler);
export const PUT = userAuth(updateAccountHandler)