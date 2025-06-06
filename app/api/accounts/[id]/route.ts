import { userAuth, adminAuth } from '@/lib/services/utilities/attachJWT';
import {accountController} from '@/lib/controllers/accountController';
import { NextRequest } from 'next/server';

// GET /api/users/[id]
async function getAccountHandler(request: NextRequest, { params }: { params: { id: string } }) {
  const enhancedRequest = { ...request, params };
  return await accountController.getAccountById(enhancedRequest);
}

// DELETE /api/users/[id]
async function deleteAccountHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await accountController.deleteAccount(enhancedRequest);
}

export const GET = userAuth(getAccountHandler);
export const DELETE = adminAuth(deleteAccountHandler);