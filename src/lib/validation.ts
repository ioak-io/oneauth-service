export const validateMandatoryFields = (
  res: any,
  data: any,
  mandatoryFields: string[]
): boolean => {
  const missingFields: string[] = [];
  mandatoryFields.forEach((fieldName) => {
    if (!data.hasOwnProperty(fieldName)) {
      missingFields.push(fieldName);
    }
  });

  if (missingFields.length === 0) {
    return true;
  }
  res.status(400);
  res.send({
    error: { missingFields },
  });
  res.end();
  return false;
};
