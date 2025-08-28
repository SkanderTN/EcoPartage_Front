// src/features/authentification/pages/LoginPage.tsx
import React from "react";
import { User } from "../../../types/index";
const API_URL = import.meta.env.VITE_API_URL;
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// Icône simple pour les inputs
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center justify-center w-10 h-full text-gray-500 text-base flex-shrink-0">
    {children}
  </span>
);

// 🔹 Props du composant
interface LoginPageProps {
  onLoginSuccess: (userData: User) => void;
  signinIn: boolean;
}

// 🔹 Schéma de validation Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Le format de l'adresse email est invalide.")
    .required("L'adresse email est obligatoire."),
  password: Yup.string().required("Le mot de passe est obligatoire."),
});

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, signinIn }) => {
  const navigate = useNavigate(); // 🔹 Initialize the navigate hook

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus({ success: false, error: null });
      setSubmitting(true);

      try {
        console.log("🔐 Début de la connexion utilisateur...");
        console.log("📧 Email de connexion:", values.email);

        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : "Identifiants invalides.";
          setStatus({ success: false, error: errorMessage });
          console.error("❌ Erreur de connexion:", {
            status: response.status,
            message: errorMessage,
            fullResponse: data,
          });
          return;
        }

        setStatus({ success: "Connexion réussie !", error: null  });
        console.log("🎫 Token d'authentification reçu");
        console.log("👤 Utilisateur maintenant connecté:", values.email);

        localStorage.setItem("authToken", data.access_token);

        // Après la réponse réussie, ajoutez ceci :
const userData: User = {
  id: data.userId,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  role: data.role,
  token: data.access_token,
};

// Sauvegarder de manière cohérente
localStorage.setItem("authToken", data.access_token);
localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("currentUser", JSON.stringify(userData));

if (onLoginSuccess) {
  onLoginSuccess(userData);
}

        console.log("💾 Token sauvegardé dans localStorage");
        console.log(
          "🚀 L'utilisateur peut maintenant accéder aux fonctionnalités protégées"
        );

        // 🔹 Redirection vers la page d'accueil après connexion réussie
        setTimeout(() => {
          navigate("/home");
        }, 1000);

      } catch (err) {
        console.error("❌ Erreur réseau lors de la connexion:", err);
        setStatus({
          success: false,
          error: "Erreur réseau ou autre problème lors de la connexion.",
        });
      } finally {
        setSubmitting(false);
        console.log("🏁 Fin du processus de connexion");
      }
    },
  });

  return (
    <div
      className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 z-2 ${
        !signinIn ? "transform translate-x-full" : ""
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white flex items-center justify-center flex-col px-12 h-full text-center"
      >
        <h1 className="text-xl font-bold m-0 text-gray-800 mb-4">Se connecter</h1>

        {/* Email Input */}
        <div
          className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
            formik.touched.email && formik.errors.email
              ? "border-red-400 shadow-red-200"
              : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
          }`}
        >
          <Icon>✉️</Icon>
          <input
            type="email"
            placeholder="Adresse email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}

        {/* Password Input */}
        <div
          className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
            formik.touched.password && formik.errors.password
              ? "border-red-400 shadow-red-200"
              : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
          }`}
        >
          <Icon>🔒</Icon>
          <input
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        )}

        <a href="#" className="text-gray-800 text-sm no-underline my-4">
          Mot de passe oublié ?
        </a>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`rounded-lg border border-bg-[#A8C2C0] bg-[#A8C2C0] text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition-all duration-300 ease-in-out mt-5 w-full max-w-[200px] ${
            formik.isSubmitting
              ? "bg-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-[#94AEAB] active:scale-95 focus:outline-none"
          }`}
        >
          {formik.isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>

        {formik.status?.error && (
          <p className="text-red-500 text-xs mt-1">{formik.status.error}</p>
        )}
        {formik.status?.success && (
          <p className="text-green-600 text-xs mt-1">{formik.status.success}</p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;