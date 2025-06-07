import { userAuth, fuseAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getTasksHandler(request:NextRequest) {
  return await tasksController.getTasks(request);
}


// PUT /api/users
async function updateTaskHandler(request:NextRequest) {
  return await tasksController.updateById(request);
}

export const GET = userAuth(getTasksHandler);
export const PUT = fuseAuth(updateTaskHandler);