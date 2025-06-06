import {adminAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';


// DELETE /api/users/[id]
async function deleteTaskHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await tasksController.deleteTask(enhancedRequest);
}

export const DELETE = adminAuth(deleteTaskHandler);