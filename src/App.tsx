import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Outlet } from "react-router";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { DashboardPage } from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import ReportPage from "./pages/Reports";

import { AuthProvider } from "./contexts/AuthProvider";
import AppLayout from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layout component that provides auth context inside the router
const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth/signup",
        element: <AuthPage />,
      },
      {
        path: "auth/login",
        element: <AuthPage />,
      },
      {
        path: "auth/forgot-password",
        element: <AuthPage />,
      },
      {
        path: "auth/logout",
        element: <HomePage />,
      },
      {
        path: "app/dashboard",
        element: (
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
          ),
      },
      {
        path: "app/profile",
        element: (
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
          ),
      },
      {
        path: "app/reports",
        element: (
          <ProtectedRoute>
            <AppLayout>
              <ReportPage />
            </AppLayout>
          </ProtectedRoute>
          ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;