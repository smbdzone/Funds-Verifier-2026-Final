export const validateAsset = (formData, formFields) => {
  const errors = {};

  formFields.forEach((field) => {
    const fieldValue = formData[field.name];

    // Skip validation if the field is not required
    if (!field.required) return;

    // Check if the value exists
    if (!fieldValue) {
      errors[field.name] = `${field.label || field.name} is required`;
      return;
    }

    // Only apply .trim() if the field is a string
    if (typeof fieldValue === "string") {
      if (fieldValue.trim() === "") {
        errors[field.name] = `${field.label || field.name} cannot be empty`;
        return;
      }
    }

    // Additional field-specific validations (e.g., number)
    if (field.type === "number" && isNaN(fieldValue)) {
      errors[field.name] = `${field.label || field.name} must be a number`;
    }

    // Custom validations (e.g., file type or format)
    if (field.type === "file" && !Array.isArray(fieldValue) && !fieldValue) {
      errors[field.name] = `${field.label || field.name} is required`;
    }
  });

  return errors;
};
