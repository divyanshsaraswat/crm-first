import { userAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';

// POST /api/users/log
async function insertHandler(request:NextRequest) {
  return await tasksController.downloadCSV(request);
}

export const POST = userAuth(insertHandler);