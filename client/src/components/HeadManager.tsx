import { useEffect } from "react";
import { useLocation } from "wouter";
import { getPageHead } from "@shared/hipaContent";

export function HeadManager() {
  const [location] = useLocation();

  useEffect(() => {
    document.title = getPageHead(location).title;
  }, [location]);

  return null;
}
