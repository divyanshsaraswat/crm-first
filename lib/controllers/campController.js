const campService = require('../services/campService');
exports.getCampaigns = async (req, res) => {
  try {
    const campaign = await campService.getCampaign();
    res.status(200).json({ message: campaign });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        const result = await campService.getCampaignById(id);
        
        res.status(200).json({ message: result});
        } catch (error) {
        console.error('Error inserting campaign:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.insertCampaign = async (req, res) => {
    try {
        const { name,status,start_date,end_date,budget} =req.body;
        const {pid,role} = req;
        
        if (!name || !status) {
            return res.status(400).json({ error: 'Name and stage is required' });
        }

        const result = await campService.insertCampaign({ 
             name,
             status,
             start_date,
             end_date,
             budget
        });
        
        res.status(201).json({ message: 'Campaign inserted successfully'});
        } catch (error) {
        console.error('Error inserting campaign:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        const result = await campService.deleteCampaign(id);
        
        res.status(200).json({ message: 'Campaign deleted successfully'});
        } catch (error) {
        console.error('Error deleting campaign:', error);
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