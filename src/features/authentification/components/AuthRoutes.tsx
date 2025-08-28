// src/features/authentification/components/AuthRoutes.tsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import AuthLayout from "./AuthLayout";
import { User } from "../../../types/index";

interface AuthRoutesProps {
  signIn: boolean;
  onSignInToggle: (value: boolean) => void;
  onLoginSuccess: (userData: User) => void;
  onSignUpSuccess: () => void;
}

const AuthRoutes = ({
  signIn,
  onSignInToggle,
  onLoginSuccess,
  onSignUpSuccess,
}: AuthRoutesProps) => {
  return (
    <AuthLayout signIn={signIn} onSignInToggle={onSignInToggle}>
      <Routes>
        <Route
          path="*"
          element={
            signIn ? (
              <LoginPage onLoginSuccess={onLoginSuccess} signinIn={signIn} />
            ) : (
              <SignUpPage onSignUpSuccess={onSignUpSuccess} signinIn={signIn} />
            )
          }
        />
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
