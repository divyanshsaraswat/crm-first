import { userAuth, fuseAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';

// GET /api/users
async function getTasksHandler(request:NextRequest) {
  return await tasksController.getTasks(request);
}

// PUT /api/users
async function deleteTaskHandler(request:NextRequest) {
  return await tasksController.deleteTask(request);
}

export const GET = userAuth(getTasksHandler);
export const DELETE = fuseAuth(deleteTaskHandler);