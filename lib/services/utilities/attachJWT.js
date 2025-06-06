// lib/auth/middleware.js
import jwt from "jsonwebtoken";
import fs from "fs";

// Helper function to verify token and extract user data
async function verifyToken(request) {
  try {
    let token;

    // Extract token from cookie header if available
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const tokenCookie = cookieHeader.split(';').find(c => c.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }

    // Attempt to parse JSON body if method allows and content-type is JSON
    let body = null;
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      try {
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // Clone request to safely read body without consuming original stream
          const clonedRequest = request.clone();
          body = await clonedRequest.json();
        }
      } catch {
        // Invalid or no body, keep body = null
      }
    }

    if (!token) {
      throw new Error("Authorization token missing or invalid.");
    }

    const publicKey = fs.readFileSync('public.key', 'utf8');
    const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    return {
      pid: decodedToken.userid,
      role: decodedToken.role,
      tenantid: decodedToken.tenantid,
      body,
    };
  } catch (error) {
    console.error("Authentication Error:", error.message);
    throw new Error("Invalid or expired token.");
  }
}

// Generic auth wrapper function
function createAuthWrapper(authType) {
  return function (handler) {
    return async (request, context) => {
      try {
        const userData = await verifyToken(request);
        // console.log(userData.body);
        // Role-based authorization
        switch (authType) {
          case 'admin':
            if (userData.role !== "admin") {
              return Response.json({ message: "Unauthorized access." }, { status: 403 });
            }
            break;
          case 'manager':
            if (userData.role !== "manager") {
              return Response.json({ message: "Unauthorized access." }, { status: 403 });
            }
            break;
          case 'fuse':
            if (userData.role !== "admin" && userData.role !== "manager") {
              return Response.json({ message: "Unauthorized access." }, { status: 403 });
            }
            break;
          case 'user':
            if (!userData.role) {
              return Response.json({ message: "Unauthorized access." }, { status: 403 });
            }
            break;
          default:
            throw new Error("Invalid auth type");
        }

        // Instead of replacing request, **attach** props while preserving NextRequest prototype
        // This avoids losing .json() and other NextRequest methods
        Object.assign(request, {
          pid: userData.pid,
          role: userData.role,
          tenantid: userData.tenantid,
          custombody: userData.body,
        });

        // Call the actual handler with the original NextRequest
        return await handler(request, context);

      } catch (error) {
        const status = error.message.includes("Unauthorized") ? 403 : 401;
        return Response.json({ message: error.message }, { status });
      }
    };
  };
}

// Export specific auth wrappers
export const adminAuth = createAuthWrapper('admin');
export const managerAuth = createAuthWrapper('manager');
export const fuseAuth = createAuthWrapper('fuse');
export const userAuth = createAuthWrapper('user');

// Export a generic auth function for custom logic
export function withAuth(handler, options = {}) {
  return async (request, context) => {
    try {
      const userData = await verifyToken(request);

      // Custom authorization logic
      if (options.allowedRoles && !options.allowedRoles.includes(userData.role)) {
        return Response.json({ message: "Unauthorized access." }, { status: 403 });
      }

      if (options.customAuth && !options.customAuth(userData)) {
        return Response.json({ message: "Unauthorized access." }, { status: 403 });
      }

      // Attach user data to request without overwriting original object
      Object.assign(request, {
        pid: userData.pid,
        role: userData.role,
        tenantid: userData.tenantid,
        user: userData,
      });

      return await handler(request, context);

    } catch (error) {
      const status = error.message.includes("Unauthorized") ? 403 : 401;
      return Response.json({ message: error.message }, { status });
    }
  };
}
