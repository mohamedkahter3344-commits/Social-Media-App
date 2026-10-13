import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { UserProfile } from "../interfaces/profile";

const API_URL = "https://route-posts.routemisr.com";
const TOKEN_KEY = "user_token";

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export type TokenContextType = {
  isAuthenticated: boolean;
  userToken: string | null;
  saveUserToken: (token: string) => void;
  logOutContext: () => void;
  dataUser: UserProfile | undefined;
};

const TokenContextProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [userToken, setUserToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem(TOKEN_KEY),
  );

  // Logout
  const logOutContext = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);

    setUserToken(null);
    setIsAuthenticated(false);

    queryClient.clear();

    window.location.href = "/auth/login";
  }, [queryClient]);

  // Save token after login or password change
  const saveUserToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUserToken(token);
    setIsAuthenticated(true);
  }, []);

  // Listen for token changes in other tabs of the same browser
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== TOKEN_KEY) return;

      // Another tab logged out
      if (!event.newValue) {
        setUserToken(null);
        setIsAuthenticated(false);
        queryClient.clear();
        window.location.href = "/auth/login";
        return;
      }

      // Token changed in another tab
      if (event.newValue !== userToken) {
        setUserToken(event.newValue);
        setIsAuthenticated(true);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [userToken, queryClient]);

  // Check whether the server still accepts the current token
  useEffect(() => {
    if (!userToken) return;

    let checking = false;
    let active = true;

    const checkToken = async () => {
      if (checking || !active) return;

      checking = true;

      try {
        await axios.get(`${API_URL}/users/profile-data`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        if (
          active &&
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          logOutContext();
        }
      } finally {
        checking = false;
      }
    };

    const intervalId = window.setInterval(checkToken, 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [userToken, logOutContext]);

  // Fetch the current user's profile
  const { data } = useQuery({
    queryKey: ["profile", userToken],
    queryFn: () =>
      axios.get(`${API_URL}/users/profile-data`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
    enabled: !!userToken,
    retry: false,
  });

  const dataUser: UserProfile | undefined = data?.data?.data?.user;

  return (
    <TokenContext.Provider
      value={{
        isAuthenticated,
        userToken,
        saveUserToken,
        logOutContext,
        dataUser,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export function useAuth(): TokenContextType {
  const context = useContext(TokenContext);

  if (!context) {
    throw new Error("useAuth must be used inside TokenContextProvider");
  }

  return context;
}

export default TokenContextProvider;
