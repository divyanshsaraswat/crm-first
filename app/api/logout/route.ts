import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );

    // Remove the token cookie by setting it to expire immediately
    response.cookies.set('token', '', {
        expires: new Date(0),
        path: '/'
    });

    return response;
}