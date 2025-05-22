import { createContext, useContext } from "react";

// Create the document context
export const DocumentContext = createContext();

// Custom hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
