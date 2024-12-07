import { IGenericErrorMessage } from '../interfaces/error';

const handleValidationError = (error: any) => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: any) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
