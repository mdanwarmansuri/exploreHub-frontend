import { createContext } from 'react';

export const PlacesContext = createContext({
  places:[],
  setPlaces:()=>{},
  isLoading:false,
  setIsLoading:()=>{}
});
