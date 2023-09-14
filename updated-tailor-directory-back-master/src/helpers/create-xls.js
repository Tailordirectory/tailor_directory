const XLSX = require('xlsx');
const { getErrorObject } = require('./errors');

/**
 * Used to generate fully customizable report by transforming dataArray
 * @param name
 * @param dataArray
 * @param res
 */
const downloadDataAsXLS = (name, dataArray, res) => {
  try {
    const ws = XLSX.utils.json_to_sheet(dataArray, {});
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'test');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${name}.xlsx`);

    const table = XLSX.write(wb, { type: 'buffer' });

    res.send(table);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw getErrorObject('general_error', 500, error);
  }
};

/**
 * Used to export entire data entity excluding some fields.
 * @param name
 * @param arr
 * @param res
 * @param skipProps
 */
const createFull = (name, arr, res, skipProps = []) => {
  const arrTransformed = arr.map((object) => {
    const newObj = {};
    // eslint-disable-next-line no-underscore-dangle,no-restricted-syntax
    for (const [prop, value] of Object.entries(object._doc)) {
      // eslint-disable-next-line no-continue
      if (skipProps.includes(prop)) continue;
      newObj[prop] = JSON.stringify(value);
    }
    return newObj;
  });

  downloadDataAsXLS(name, arrTransformed, res);
};

module.exports = {
  createFull,
  downloadDataAsXLS,
};
