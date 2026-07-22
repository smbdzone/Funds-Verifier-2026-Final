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

const safeTrim = (value) => String(value ?? "").trim();

/** Validation for off-plan property on add-asset. */
export const validateOffPlanAsset = (formData, formFields) => {
  const errors = { ...validateAsset(formData, formFields) };

  if (!safeTrim(formData.country)) {
    errors.country = "Country is required";
  }
  if (!safeTrim(formData.city)) {
    errors.city = "City is required";
  }
  if (!safeTrim(formData.neighbourhood)) {
    errors.neighbourhood = "Neighbourhood is required";
  }
  if (!safeTrim(formData.propertyType)) {
    errors.propertyType = "Property type is required";
  }

  if (!safeTrim(formData.title)) {
    errors.title = "Title is required";
  } else if (formData.title.length > 50) {
    errors.title = "Title must be less than 50 characters";
  }

  if (!safeTrim(formData.priceFrom)) {
    errors.price = "Price from is required";
  } else if (Number(formData.priceFrom) === 0) {
    errors.price = "Price from is invalid";
  } else if (!safeTrim(formData.priceTo)) {
    errors.price = "Price to is required";
  } else if (Number(formData.priceTo) === 0) {
    errors.price = "Price to is invalid";
  } else if (Number(formData.priceTo) < Number(formData.priceFrom)) {
    errors.price = "Price to must be greater than or equal to price from";
  }

  if (
    !safeTrim(formData.deliveryQuarter) ||
    !safeTrim(formData.deliveryYear)
  ) {
    errors.deliveryTime = "Delivery time is required";
  }

  if (!safeTrim(formData.developer)) {
    errors.developer = "Developer is required";
  }

  if (!safeTrim(formData.bedrooms)) {
    errors.bedrooms = "Bedrooms is required";
  }

  if (!safeTrim(formData.bathrooms)) {
    errors.bathrooms = "Bathrooms is required";
  }

  if (
    !safeTrim(formData.sizeSQFTFrom || formData.sizeSQFT) &&
    !safeTrim(formData.sizeSQMFrom || formData.sizeSQM)
  ) {
    errors.sizeSQFT = "Size from is required";
  }

  const thumbnail =
    formData.thumbnailImg || formData.thumbnail;
  if (!thumbnail) {
    errors.thumbnail = "Thumbnail is required";
  }

  const pictures = formData.pictures;
  if (!Array.isArray(pictures) || pictures.length === 0) {
    errors.pictures = "At least one picture is required";
  }

  if (formData.additionalDescription?.length > 1000) {
    errors.additionalDescription =
      "Additional description must be less than 1000 characters";
  }

  const plan = Array.isArray(formData.paymentPlan) ? formData.paymentPlan : [];
  const downPayment = plan[0]?.sharePercent;
  if (!safeTrim(downPayment)) {
    errors.paymentPlan = "Down payment share is required";
  } else {
    const totalShare = plan.reduce(
      (sum, step) => sum + Number(step?.sharePercent || 0),
      0,
    );
    if (totalShare > 100) {
      errors.paymentPlan = "Payment plan shares cannot exceed 100%";
    }
  }

  return errors;
};
