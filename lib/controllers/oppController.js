const oppService = require('../services/oppService');
exports.getOpps = async (req, res) => {
  try {
    const opps = await oppService.getOpps();
    res.status(200).json({ message: opps });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getOppById = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Ops ID is required' });
        }

        const result = await oppService.getOppById(id);
        
        res.status(200).json({ message: result});
        } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}


exports.insertOpps = async (req, res) => {
    try {
        const { name, amount, stage, close_date, account_id, contact_id,assigned_user_id } =req.body;
        const {pid,role} = req;
        
        if (!name || !stage) {
            return res.status(400).json({ error: 'Name and stage is required' });
        }

        const result = await oppService.insertOpp({ 
             name, 
             amount, 
             stage, 
             close_date, 
             account_id, 
             contact_id,
             pid 
        });
        
        res.status(201).json({ message: 'Opportunity inserted successfully'});
        } catch (error) {
        console.error('Error inserting opportunity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteOpp = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Opportunity ID is required' });
        }

        const result = await oppService.deleteOpp(id);
        
        res.status(200).json({ message: 'Opportunity deleted successfully'});
        } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Example data object matching the schema
/* Example request body for creating a task:
{
    "subject": "Complete Project Report",
    "body": "Write and submit the quarterly project status report",
    "status": "pending",
    "due_date": "2024-01-15",
    "sender_email": "john.doe@example.com"
}
*/