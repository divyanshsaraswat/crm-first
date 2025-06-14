// lib/controllers/tasksController.js
import { getTasks, downloadCSV, getTaskById, insertTask, updateTask, deleteTask,updateTaskbyId } from '@/lib/services/tasksService';
import { addLogs } from '@/lib/services/userService';

export const tasksController = {
  updatetoComplete: async(request)=>{
    try {
      const { pid, role, tenantid } = request;
      const {id} = await request.params
      console.log(id);
      const tasks = await updateTaskbyId(id);
      const log = await addLogs({ pid, tenantid, action: "Changed task status.", role });
      return Response.json({ message:tasks }, { status: 200 });

    } catch (error) {
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });

    }
  },
  getTasks: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const tasks = await getTasks();
      const log = await addLogs({ pid, tenantid, action: "Retrieved tasks list", role });
      return Response.json({ message: tasks }, { status: 200 });
    } catch (error) {
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  downloadCSV: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const records = await request.json();

      
      const result = await downloadCSV(records);
      const log = await addLogs({ pid, tenantid, action: "Downloaded tasks CSV", role });
      
      return new Response(result, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="tasks.csv"'
        }
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  getTaskById: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const { id } = await request.params;
      
      if (!id) {
        return Response.json({ error: 'Task ID is required' }, { status: 400 });
      }

      const result = await getTaskById(id);
      const log = await addLogs({ pid, tenantid, action: "Retrieved task by ID", role });
      return Response.json({ message: result }, { status: 200 });
    } catch (error) {
      console.error('Error fetching task:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  insertTask: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const body  = await request.json();
      const { subject, body: taskBody, status, due_date, contact_id, assigned_user_id } = body;
      
      if (!subject || !status) {
        return Response.json({ error: 'Subject and status are required' }, { status: 400 });
      }
      
      const result = await insertTask({ 
        subject,  
        body: taskBody, 
        status,
        due_date,
        contact_id,
        assigned_user_id,
        pid
      });
      
      const log = await addLogs({ pid, tenantid, action: "Inserted new task", role });
      return Response.json({ message: 'Task inserted successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error inserting task:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  updateById: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const { id, subject, body: taskBody, status, due_date, assigned_user_id } = await request.json();
      
      if (!subject || !status) {
        return Response.json({ error: 'Subject and status are required' }, { status: 400 });
      }
      
      const result = await updateTask({ 
        id,
        subject,  
        body: taskBody, 
        status,
        due_date,
        assigned_user_id,
      });
      
      const log = await addLogs({ pid, tenantid, action: "Updated task", role });
      return Response.json({ message: 'Task updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error updating task:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  },

  deleteTask: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const { id } = await request.params;
      
      if (!id) {
        return Response.json({ error: 'Task ID is required' }, { status: 400 });
      }

      const result = await deleteTask(id);
      const log = await addLogs({ pid, tenantid, action: "Deleted task", role });
      return Response.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting task:', error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
};

/* Example request body for creating a task:
{
    "subject": "Complete Project Report",
    "body": "Write and submit the quarterly project status report",
    "status": "pending",
    "due_date": "2024-01-15",
    "contact_id": 123,
    "assigned_user_id": 456
}
*/