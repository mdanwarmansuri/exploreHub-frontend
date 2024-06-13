import { createContext } from 'react';

export const UsersContext = createContext({
  users:[],
  setUsers:()=>{},
  isLoading:false,
  setIsLoading:()=>{}
});
