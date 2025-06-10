import { AnalyticsProvider } from "./AnalyticsContext";
import { AuthProvider } from "./AuthContext";
import { DocumentProvider } from "./DocumentContext";
import { UserProvider } from "./UserContext";

// Main App Provider that combines all contexts
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <DocumentProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </DocumentProvider>
      </UserProvider>
    </AuthProvider>
  );
};

// Re-export all hooks for convenience
export { useAuth } from "./AuthContext";
export { useDocuments } from "./DocumentContext";
export { useAnalytics } from "./AnalyticsContext";
