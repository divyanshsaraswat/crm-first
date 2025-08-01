const contactService = require('../services/contactService');


exports.getContacts = async (req, res) => {
  try {
    const { pid, role } = req;
    const data = { pid, role };
    const users = await contactService.getContacts(data);
    res.status(200).json({ message:users});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactService.getContactById(id);
        if (contact) {
            res.status(200).json({ message: contact });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.insertContact = async (req, res) => {
    try {
        const { first_name, last_name, email, phone,account_id } = req.body;
        const {pid,role} = req;
        if (!last_name) {
            return res.status(400).json({ error: 'Last name is required' });
        }

        const result = await contactService.insertContact({ 
            first_name, 
            last_name, 
            email, 
            phone, 
            account_id,
            pid 
        });
        
        res.status(201).json({ message: 'Contact inserted successfully'});
        } catch (error) {
        console.error('Error inserting contact:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}
exports.updateById = async (req,res)=>{
  try {
    const {id,first_name,last_name,email,phone,account_id} = req.body
    const result = await contactService.updateById({id,first_name,last_name,email,phone,account_id});
    res.status(200).json({"message":"Contact Updated."})
  } catch (error) {
    res.status(500).json({error:error})
  }
}
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactService.deleteContact(id);
    if (result) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.downloadCSV = async (req, res) => {
  try {
  const{ records} = req.body;

  // console.log(records);
  
  const result = await contactService.downloadCSV(records);
  res.status(200)
    .set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users.csv"'
    })
    .send(result);
  }
  catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

