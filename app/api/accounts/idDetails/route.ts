import { userAuth } from '@/lib/services/utilities/attachJWT';
import {accountController} from '@/lib/controllers/accountController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function getidDetailsHandler(request:NextRequest) {
  return await accountController.getidDetails(request);
}

export const GET = userAuth(getidDetailsHandler);