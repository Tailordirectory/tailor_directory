const Business = require('../../classes/models-controllers/Business');
const { getErrorObject } = require('../../helpers/errors');
const XLSX = require('xlsx')
const props = ["_id", 'workTime', 'tags', 'location', 'media', 'ownerId', 'createdAt', 'updatedAt']

module.exports = async (req, res) => {
  const session = await Business.model.startSession();
  await session.startTransaction()
  let row = 0
  try {
    const xls = req.file.buffer;
    const wb = XLSX.read(xls)
    const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

    for (let i = 0; i < json.length; i++){
      row=i;
      const el = json[i];

      for (const prop of props){
        if (el[prop] && typeof el[prop] !== "object"){
          el[prop] = JSON.parse(el[prop])
          delete el._id
        }
      }
      await Business.create(el)
    }


    await session.commitTransaction()

    res.send({ success: true })
    

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    error.message = `Error in row ${row+1}: ${error.message}`
    throw getErrorObject('general_error', 500, error);
  }
};
