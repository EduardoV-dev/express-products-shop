const fs = require('fs');

exports.getData = path => {
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return [];
  }
};

exports.addData = (path, data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
};
