import request from '@/utils/request';

export const updatePicture = (payload: any) =>
  request.post('/upload/picture', payload, {
    headers: {
      Accept: '*/*',
      Connection: 'keep-alive',
    },
  });
