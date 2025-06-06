const leadsService = require('../services/leadsService');
exports.getLeads = async (req, res) => {
  try {
    const leads = await leadsService.getLeads();
    res.status(200).json({ message: leads });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.insertLead = async (req, res) => {
    try {
        const { first_name,last_name,email,status,contacts_user_id} = req.body;
        const {pid,role} = req;
        
        if (!last_name || !status) {
            return res.status(400).json({ error: 'Lastname and status is required' });
        }

        const result = await leadsService.insertLead({ 
            first_name,
            last_name,
            email,
            status,
            contacts_user_id,
            pid 
        });
        
        res.status(201).json({ message: 'Lead inserted successfully'});
        } catch (error) {
        console.error('Error inserting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Lead ID is required' });
        }

        const result = await leadsService.deleteLead(id);
        
        res.status(200).json({ message: 'Lead deleted successfully'});
        } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Example data object matching the schema
// Example request body for Postman
/*
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "status": "active",
    "contacts_user_id": 12345
}
*/