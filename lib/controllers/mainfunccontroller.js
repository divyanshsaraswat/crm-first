const mainservice = require('../services/mainfunc');
exports.mainfunc = async (req, res) => {
  try{
   const execSQL = await mainservice.runSQL();
   res.status(200).json(execSQL);
  }catch(error){
    console.error('Controller caught error:', error);
    res.status(500).json({ error: 'Internal Server Error inner' });
  }
}