// lib/controllers/userController.js
import { insertSetting,getUsers,sendMail,getUserById,deleteUser,checkcmd,updateById,insertUser,downloadCSV,updateSettings,forgotpassword,getAllByUserIdNotif,getDetails,getRoles,getSettings,addLogs,login,getSignedDetails,deleteByIdNotif,markAsReadNotif,createNotif } from '@/lib/services/userService';
import { cookies } from 'next/headers';
import cron from 'node-cron';
export const userController = {
  getUsers: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const users = await getUsers({ pid, role, tenantid });
      const log = await addLogs({ pid, tenantid, action: "Showed Users list", role });
      return Response.json({ message: users }, { status: 200 });
    } catch (error) {
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },
  scheduleNotification: async (request)=>{
  let timestamp = '2025-06-13T14:12:00Z';
  const date = new Date(timestamp);
  const minute = date.getUTCMinutes();
  const hour = date.getUTCHours();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // cron months start from 1

  // schedule: "m h D M *"
  const cronTime = `${minute} ${hour} ${day} ${month} *`;

  cron.schedule(cronTime, () => {
    console.log(cronTime)
  });
  },

  sendMail: async (request) => {
    try {
      const { pid, role } = request;
      const body = await request.json();
      const { title, body: mailBody, sender } = body;
      const result = await sendMail({ title, body: mailBody, sender });
      const log = await addLogs({ pid, action: "Sent email", role });

      if (result) {
        return Response.json(result, { status: 200 });
      }
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
  insertSetting: async(request)=>{
    try {
      const result = await insertSetting();
      return Response.json(result, { status: 200 });

    } catch (error) {
            return Response.json({ message: "Internal Server Error" }, { status: 500 });

    }
  },
  changePassword: async (request) => {
    try {
      const { pid, role } = request;
      const body = await request.json();
      const { password, oldpassword } = body;
      console.log({ password, oldpassword, pid });
      const result = await forgotpassword({ pid, oldpassword, password });
      const log = await addLogs({ pid, action: "Changed password", role });
      
      if (result) {
        return Response.json(result, { status: 200 });
      }
      if (!result) {
        return Response.json({ message: "Password do not match!" }, { status: 403 });
      }
    } catch (error) {
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },

  getSettings: async (request) => {
    try {
      const { pid } = request;
      const result = await getSettings({ pid });
      return Response.json(result, { status: 200 });
    } catch (error) {
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },

  addLogs: async (request) => {
    try {
      const { pid, tenantid } = request;
      const body = await request.json();
      const { action, role } = body;
      const result = await addLogs({ pid, tenantid, action, role });
      return Response.json(result, { status: 200 });
    } catch (error) {
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },

  getSignedDetails: async (request) => {
    try {
      const { pid } = request;
      const result = await getSignedDetails({ pid });
      return Response.json(result,{ status: 200 });
    } catch (error) {
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },

  updateSettings: async (request) => {
    try {
      const { pid, role } = request;
      const body = await request.json();
      const {
        notify_email,
        notify_browser,
        notify_lead_alerts,
        notify_task_reminders,
        date_format,
        time_format,
        currency,
        theme,
      } = body;
      
      // console.log({
      //   notify_email,
      //   notify_browser,
      //   notify_lead_alerts,
      //   notify_task_reminders,
      //   date_format,
      //   time_format,
      //   currency,
      //   theme,
      // });
      
      const result = await updateSettings({
        pid,
        notify_email,
        notify_browser,
        notify_lead_alerts,
        notify_task_reminders,
        date_format,
        time_format,
        currency,
        theme
      });
      const log = await addLogs({ pid, action: "Updated settings", role });

      return Response.json(result, { status: 200 });
    } catch (error) {
      return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },

  getRoles: async (request) => {
    try {
      const { pid, role } = request;
      const result = await getRoles(); 
      // const log = await addLogs({ pid, action: "Viewed roles list", role });
      return Response.json({ message: result }, { status: 200 });
    } catch (error) {
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  verify: async (request) => {
    try {
      const { pid } = request;
      const data = await getDetails(pid);
      return Response.json(data, { status: 200 });
    } catch (error) {
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  updateById: async (request) => {
    try {
      const { pid, role } = request;
      const { id, username, email, role: userrole } = await request.json();
      const result = await updateById({ id, username, email, userrole });
      // const log = await addLogs({ pid,tenantid, action: "Updated user details", role });
      return Response.json({ message: "Updated Successfully." }, { status: 200 });
    } catch (error) {
      return Response.json({ error: error }, { status: 500 });
    }
  },

  downloadCSV: async (request) => {
    try {
      const { pid, role,tenantid } = request;
      const body = await request.json();
      const { records } = body;

      const result = await downloadCSV(records);
      const log = await addLogs({ pid,tenantid, action: "Downloaded users CSV", role });

      return new Response(result, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="users.csv"'
        }
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  getUserById: async (request) => {
    try {
      const { pid, role } = request;

      const id = request.params?.id || request.query?.id;
      if (!id) {
        throw new Error('User ID is required');
      }
      if (!id) {
        return Response.json({ error: 'User ID is required' }, { status: 400 });
      }
      
      const user = await getUserById({ id });
      if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
      
      const log = await addLogs({ pid, action: "Viewed user details", role });
      return Response.json({ message: 'hey' }, { status: 200 });
    } catch (error) {
      console.error('Error fetching user:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  insertUser: async (request) => {
    try {
      const { pid, role, tenantid } = request;
     const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json({ error: "Invalid or missing Content-Type" }, { status: 400 });
    }

    // Try parsing body
    let body = {};
    try {
      body = await request.json();
    } catch (err) {
      return Response.json({ error: "Invalid or empty JSON body" }, { status: 400 });
    }

    const {username,email,password,userrole} = body;
      
      if (!username || !email || !password) {
        return Response.json({ error: 'All fields are required' }, { status: 400 });
      }
      
      if (role === 'user') {
        return Response.json({ error: 'You are not authorized to create a user' }, { status: 400 });
      }
      
     const result = await insertUser({ username, email, password, userrole, pid, tenantid });
     const usersettings = await insertSetting(result);
     await addLogs({ pid,tenantid, action: "Created new user", role });
      return Response.json({ message: 'User inserted successfully', role: role, id: pid }, { status: 201 });
    } catch (error) {
      console.error('Error inserting user:', error);
      return Response.json({ error: 'Internal Server Error outer' }, { status: 500 });
    }
  },

  deleteUser: async (request) => {
    try {
      const { pid, role } = request;
      const { id } = await request.params;
      
      if (!id) {
        return Response.json({ error: 'User ID is required' }, { status: 400 });
      }
      
      if (role === 'user') {
        return Response.json({ error: 'You are not authorized to delete a user' }, { status: 400 });
      }
      
      const result = await deleteUser(id);
      const log = await addLogs({ pid, action: "Deleted user", role });
      
      if (result.affectedRows === 0) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
      
      return Response.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  checkcmd: async (request) => {
    try {
      const body = await request.json();
      const { query } = body;
      
      if (!query) {
        return Response.json({ error: 'Query is required' }, { status: 400 });
      }
      
      const result = await checkcmd(query);
      return Response.json({ message: result }, { status: 200 });
    } catch (error) {
      console.error('Error executing query:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  login: async (request) => {
    try {
      const body = await request.json();
      const { email, password } = body;
      
      if (!email) {
        return Response.json({ error: 'Username is required' }, { status: 400 });
      }
      
      if (!password) {
        return Response.json({ error: 'Password is required' }, { status: 400 });
      }

      const result = await login(email, password);

      if (!result) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      // Set cookie in Next.js
      const response = Response.json({ message: "Login Successful." }, { status: 200 });
      response.headers.set('Set-Cookie', `token=${result}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
      
      return response;
    } catch (error) {
      console.error('Error checking password:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  getAllNotifications: async (request) => {
    try {
      const { pid } = request;
      const notifications = await getAllByUserIdNotif(pid);
      return Response.json({ notifications }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  createNotification: async (request) => {
    try {
      const { pid, tenantid } = request;
      const body = await request.json();
      const { user_id, title, message, role } = body;
      
      const result = await createNotif({ user_id, title, message, pid });
      await addLogs({ pid, tenantid, action: "Created notification", role });
      return Response.json({ message: "Notification created successfully." }, { status: 201 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  markAsRead: async (request) => {
    try {
      const { pid, tenantid, role, params } = request;
      const { id } = params;
      
      const result = await markAsReadNotif(id);
      await addLogs({ pid, tenantid, action: "Marked notification as read", role });
      return Response.json({ message: "Notification marked as read." }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  deleteNotification: async (request) => {
    try {
      const { pid, role, tenantid, params } = request;
      const { id } = params;
      
      await deleteByIdNotif(id);
      await addLogs({ pid, tenantid, action: "Deleted notification", role });
      return Response.json({ message: "Notification deleted successfully." }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
};