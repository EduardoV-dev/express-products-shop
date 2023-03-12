const fs = require('fs');
const path = require('path');

exports.getFieldErrorMessageFromErrors = (errors, field) =>
    errors.find(error => error.param === field)?.msg || null;

exports.removeProductImageFromBucket = image => {
    const pathToImage = path.join(__dirname, 'data', image);
    fs.unlinkSync(pathToImage);
};
