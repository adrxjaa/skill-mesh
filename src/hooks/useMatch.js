import { useContext } from "react";
import MatchContext from "../context/MatchContext";

/**
 * Convenience hook for consuming MatchContext.
 */
export default function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
}
