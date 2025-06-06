import {userController} from '@/lib/controllers/userController';
import { NextRequest } from 'next/server';

// POST /api/users/login (no auth required)
export async function POST(request: NextRequest) {
  return await userController.login(request);
}