import { createContext } from 'react';

export const ConnectionContext = createContext({
  friends:[],
  setFriends:()=>{},
  requestsSent:[],
  setRequestsSent:()=>{},
  requestsReceived:[],
  setRequestsReceived:()=>{},
});
