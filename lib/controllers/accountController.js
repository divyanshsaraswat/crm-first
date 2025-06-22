// lib/controllers/accountController.js
import { getAccounts, updateById, getAccountsList, getidDetails, getAccountById, insertAccount, deleteAccount, downloadCSV } from '@/lib/services/accountService';
import { addLogs, sendMail,createWhatsApp } from '@/lib/services/userService';

export const accountController = {
  getAccounts: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const data = { pid, role, tenantid };
      console.log(data)
      const accounts = await getAccounts(data);
      const log = await addLogs({ pid, tenantid, action: "Showed Accounts list", role });
      return Response.json({ message: accounts }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error out" }, { status: 500 });
    }
  },

  updateById: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const body = await request.json();
      const {
        id,
        name,
        industry,
        website,
        Zone,
        Rating,
        ContPerson,
        Address1,
        Address2,
        City,
        Zip,
        State,
        Country,
        phone,
        waphone,
        email,
        BusinessNature,
        SourceID,
        DesignationID,
        StatusID,
      } = body;
      
      const result = await updateById({
        id,
        name,
        industry,
        website,
        pid,
        Zone,
        Rating,
        ContPerson,
        Address1,
        Address2,
        City,
        Zip,
        State,
        Country,
        phone,
        waphone,
        email,
        BusinessNature,
        SourceID,
        DesignationID,
        StatusID,
      });
      const log = await addLogs({ pid, tenantid, action: "Updated Account.", role });
      return Response.json({ message: "Contact Updated." }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  getAccountLists: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const account = await getAccountsList(tenantid);
      const log = await addLogs({ pid, tenantid, action: "Showed Accounts list", role });
      return Response.json({ message: account }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error in" }, { status: 500 });
    }
  },

  getidDetails: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const result = await getidDetails({ tenantid });
      const log = await addLogs({ pid, tenantid, action: "Showed ID details", role });
      return Response.json({ message: result }, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  getAccountById: async (request) => {
    try {
      const { role, tenantid, params } = request;
      const { id } = params;
      
      if (!id) {
        return Response.json({ error: "Account ID is required" }, { status: 400 });
      }
      
      const account = await getAccountById({ id, tenantid });
      if (!account) {
        return Response.json({ error: "Account not found" }, { status: 404 });
      }
      
      return Response.json({ message: account }, { status: 200 });
    } catch (error) {
      console.error("Error fetching account:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },

  insertAccount: async (request) => {
    try {
      const { pid, role, tenantid,tenant_name } = request;
      const body = await request.json();
      const {
        name,
        website,
        status_type,
        source_type,
        updated_at,
        CustomerName,
        Zone,
        Rating,
        ContPerson,
        Address1,
        Address2,
        City,
        Zip,
        State,
        Country,
        phone,
        waphone,
        email,
        designation_name,
        BusinessNature,
        JoiningDate,
        SourceID,
        DesignationID,
        StatusID,
      } = body;

      if (!name) {
        return Response.json({ error: "Account name is required" }, { status: 400 });
      }

      const result = await insertAccount({
        name,
        website,
        status_type,
        source_type,
        pid,
        updated_at,
        CustomerName,
        Zone,
        Rating,
        ContPerson,
        Address1,
        Address2,
        City,
        Zip,
        State,
        Country,
        phone,
        waphone,
        email,
        tenantid,
        designation_name,
        BusinessNature,
        JoiningDate,
        SourceID,
        DesignationID,
        StatusID,
      });
      
      const mailresult = await sendMail({ sender: email,type:"accountsR",company:tenant_name });
      if (mailresult) {
        const log = await addLogs({ pid, tenantid, action: "Added New Account", role });
        const createWhatsApps= await createWhatsApp({type:"creation",to:waphone,params:[name,"ConvertCRM",name,new Date().toLocaleDateString(),tenant_name]})
        return Response.json({ message: "Account inserted successfully" }, { status: 201 });
      }
        return Response.json({ message: "Account inserted successfully" }, { status: 201 });
    } catch (error) {
      console.error("Error inserting account:", error);
      return Response.json({ error: "Internal Server Error outer" }, { status: 500 });
    }
  },

  deleteAccount: async (request) => {
    try {
      const { pid, role, tenantid } = request;
      const { id } = await request.params;

      if (!id) {
        return Response.json({ error: "Account ID is required" }, { status: 400 });
      }

      const result = await deleteAccount(id);
      const log = await addLogs({ pid, tenantid, action: "Deleted Account", role });
      return Response.json({ message: "Account deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting account:", error);
      return Response.json({ error: "Internal Server Error outer" }, { status: 500 });
    }
  },

  downloadCSV: async (request) => {
    try {
      const { pid, tenantid, role } = request;
      const body = await request.json();
      const { records } = body;

      const result = await downloadCSV(records);
      const log = await addLogs({ pid, tenantid, action: "Downloaded CSV file", role });
      
      return new Response(result, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="users.csv"',
        }
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
};