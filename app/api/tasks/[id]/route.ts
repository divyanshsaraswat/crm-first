import {adminAuth, userAuth } from '@/lib/services/utilities/attachJWT';
import {tasksController} from '@/lib/controllers/tasksController';
import { NextRequest } from 'next/server';


// DELETE /api/users/[id]
async function deleteTaskHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await tasksController.deleteTask(enhancedRequest);
}
async function getTaskHandler(request:NextRequest, { params }:{params:{id:string}}) {
  const enhancedRequest = { ...request, params };
  return await tasksController.getTaskById(enhancedRequest);
}

async function UpdatetaskstatusHandler(request:NextRequest,{ params }:{params:{id:string}}) {
    const enhancedRequest = { ...request, params };
  return await tasksController.updatetoComplete(enhancedRequest);
}
export const DELETE = adminAuth(deleteTaskHandler);
export const GET = userAuth(getTaskHandler);
export const PUT = userAuth(UpdatetaskstatusHandler);