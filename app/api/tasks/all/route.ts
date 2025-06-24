import { userAuth, fuseAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getTasksAllHandler(request:NextRequest) {
  return await tasksController.getTasksAll(request);
}

export const GET = userAuth(getTasksAllHandler);
