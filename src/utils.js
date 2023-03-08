exports.getFieldErrorMessageFromErrors = (errors, field) =>
    errors.find(error => error.param === field)?.msg || null;
