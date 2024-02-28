import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loggedOut, setAccess } from "../slices/sessionSlice";
import { Mutex } from 'async-mutex';
import url from '../utils/url';

const mutex = new Mutex();

export const tags = [
  'User', 'Institution', 'Institutions', 
  'Professors', 'Subjects', 'Subject'
];

const baseQuery = fetchBaseQuery({ 
  baseUrl: `${url}/`, 
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().session.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
      
      if(headers.has('Content-Type')) {
        headers.set('Content-Type', headers.get('Content-Type'));
      } else {
        headers.set('Content-Type', 'application/json');
      }
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if(result?.error?.status === 401) {
    api.dispatch(setAccess(''));
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      
      try {
        const refreshToken = api.getState().session.refreshToken;

        if(refreshToken) {
          const refreshResult = await baseQuery({ 
            url: '/refresh',
            method: 'POST', 
            body: { refresh_token: refreshToken },
          },
          api, extraOptions);
          
          if(refreshResult.data) { 
            api.dispatch(setAccess(refreshResult.data.access_token));
            result = await baseQuery(args, api, extraOptions);
          } else { 
            api.dispatch(loggedOut());
          }

        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: tags,
  endpoints: (builder) => ({}),
});
