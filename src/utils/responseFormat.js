export const errorResponse = (message) => ({
  status: 'error',
  data: null,
  message,
});

export const successResponse = (data, message) => ({
  status: 'success',
  data,
  message,
});
