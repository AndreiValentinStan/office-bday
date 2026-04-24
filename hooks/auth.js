import { useContext } from "react";
import { Auth } from "../components/authentication/AuhtProvider";

export function useAuth() {
  const authContext = useContext(Auth);
  return authContext;
}
