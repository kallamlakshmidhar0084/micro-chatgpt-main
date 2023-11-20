// TokenContext.js
import { createContext, useState } from "react";
export const TokenContext = createContext({
  token: null,
  setNewToken: () => null,
});
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const setNewToken = (token) => {
    console.log({ token, here: "context" });
    setToken(token);
  };
  return (
    <TokenContext.Provider value={{ token, setNewToken }}>
      {children}
    </TokenContext.Provider>
  );
};
