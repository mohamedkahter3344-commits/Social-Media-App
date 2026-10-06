import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export type TokenContextType = {
  isAuthenticated: boolean;
  userToken: string | null;
  saveUserToken: (token: string) => void;
  logOutContext: () => void;
};




const TokenContextProvider = ({children}:{children:ReactNode}) => {
  useEffect(() => {
   const token = localStorage.getItem("user_token");
  
   if (token !== null) {
     saveUserToken(token);
     setIsAuthenticated(true);
   }


  }, []);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  function saveUserToken(token: string) {
    setUserToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("user_token", token);
  }

  function logOutContext() {
    setUserToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user_token");
  }

  console.log(userToken);
  
  return (
  
      <TokenContext.Provider value={{isAuthenticated,userToken,saveUserToken,logOutContext}}>
        {children}
      </TokenContext.Provider>
    
  )
}

export function useAuth():TokenContextType {
  const context = useContext(TokenContext)

   if (!context) {
    throw new Error("useAuth must be used inside TokenContextProvider");
  }

  return context;
}

export default TokenContextProvider

