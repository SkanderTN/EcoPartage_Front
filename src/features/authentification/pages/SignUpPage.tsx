// src/features/authentification/pages/SignUpPage.tsx
import React, { useState, useRef, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { useFormik } from "formik";
import * as Yup from "yup";

// Icône simple pour les inputs
const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center justify-center w-10 h-full text-gray-500 text-base flex-shrink-0">
    {children}
  </span>
);

// 🔹 Types
interface SignUpPageProps {
  onSignUpSuccess: () => void;
  signinIn: boolean;
}

// 🔹 Schéma de validation Yup
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("Le prénom est obligatoire."),
  lastName: Yup.string().trim().required("Le nom est obligatoire."),
  email: Yup.string()
    .email("Le format de l'adresse email est invalide.")
    .required("L'adresse email est obligatoire."),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
    .required("Le mot de passe est obligatoire."),
  role: Yup.string()
    .oneOf(
      ["simple", "association", "company"],
      "Veuillez sélectionner une activité valide."
    )
    .required("Veuillez sélectionner une activité."),
  nameAsso: Yup.string().when("role", {
    is: "association",
    then: (schema) =>
      schema.trim().required("Le nom de l'association est obligatoire."),
    otherwise: (schema) => schema.notRequired(),
  }),
  nameCompany: Yup.string().when("role", {
    is: "company",
    then: (schema) =>
      schema.trim().required("Le nom de la société est obligatoire."),
    otherwise: (schema) => schema.notRequired(),
  }),
  contactPhone: Yup.string().when("role", {
    is: (role: string) => role === "association" || role === "company",
    then: (schema) =>
      schema
        .trim()
        .required("Le numéro de contact est obligatoire.")
        .matches(
          /^\d+$/,
          "Le numéro de contact doit contenir uniquement des chiffres."
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  profilePicture: Yup.mixed()
    .test(
      "fileSize",
      "La taille de l'image est trop grande. La taille maximale autorisée est de 10 Mo.",
      (value) => {
        if (!value) return true;
        return (value as File).size <= 10 * 1024 * 1024;
      }
    )
    .notRequired(),
});

const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUpSuccess,
  signinIn,
}) => {
  const [profilePictureName, setProfilePictureName] = useState<string>(
    "Aucun fichier choisi"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleOptions: {
    value: "simple" | "association" | "company";
    label: string;
    icon: string;
  }[] = [
    { value: "simple", label: "Individuel", icon: "👤" },
    { value: "association", label: "Association", icon: "🏢" },
    { value: "company", label: "Société", icon: "🏭" },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "" as "simple" | "association" | "company" | "",
      nameAsso: "",
      contactPhone: "",
      nameCompany: "",
      profilePicture: null as File | null,
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setStatus({ success: false, error: null });
      setSubmitting(true);

      try {
        console.log("🚀 Début de l'inscription utilisateur...");
        const formData = new FormData();
        const dto = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: values.role,
          ...(values.role === "association" && {
            nameAsso: values.nameAsso,
            contactPhone: values.contactPhone,
          }),
          ...(values.role === "company" && {
            nameCompany: values.nameCompany,
            contactPhone: values.contactPhone,
          }),
        };

        formData.append("dto", JSON.stringify(dto));
        if (values.profilePicture) {
          formData.append("profilePicture", values.profilePicture);
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          body: formData,
        });

        if (response.status === 413) {
          const errorMsg =
            "La taille de l'image est trop grande. La taille maximale autorisée est de 10 Mo.";
          setStatus({ success: false, error: errorMsg });
          formik.setFieldError("profilePicture", errorMsg);
          setSubmitting(false);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Erreur lors de l'enregistrement.";
          setStatus({ success: false, error: errorMessage });
          return;
        }

        setStatus({
          success: true,
          error:
            "Enregistrement réussi ! Vous pouvez maintenant vous connecter.",
        });
        console.log("✅ Utilisateur créé avec succès!");
        resetForm();
        setProfilePictureName("Aucun fichier choisi");

        if (onSignUpSuccess) onSignUpSuccess();
      } catch (err) {
        console.error("❌ Erreur réseau:", err);
        setStatus({
          success: false,
          error: "Erreur réseau ou autre problème lors de l'inscription.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // 🔹 Effet pour fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    formik.setFieldValue("profilePicture", file);
    setProfilePictureName(file ? file.name : "Aucun fichier choisi");
    formik.setFieldTouched("profilePicture", true, false);
  };

  const handleRoleSelect = (
    selectedRole: "simple" | "association" | "company"
  ) => {
    formik.setFieldValue("role", selectedRole);
    setIsDropdownOpen(false);
    formik.setFieldTouched("role", true, false);
  };

  return (
    <div
      className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 opacity-0 z-1 ${
        !signinIn ? "transform translate-x-full opacity-100 z-10" : ""
      }`}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white flex items-center justify-center flex-col px-12 h-full text-center"
      >
        <h1 className="text-xl font-bold m-0 text-gray-800 mb-4">Créer un compte</h1>

        {/* First Name Input */}
        <div
          className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
            formik.touched.firstName && formik.errors.firstName
              ? "border-red-400 shadow-red-200"
              : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
          }`}
        >
          <Icon>👤</Icon>
          <input
            type="text"
            placeholder="Prénom"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
          />
        </div>
        {formik.touched.firstName && formik.errors.firstName && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
        )}

        {/* Last Name Input */}
        <div
          className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
            formik.touched.lastName && formik.errors.lastName
              ? "border-red-400 shadow-red-200"
              : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
          }`}
        >
          <Icon>👤</Icon>
          <input
            type="text"
            placeholder="Nom"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
          />
        </div>
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
        )}

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

        {/* File Upload */}
        <div className="relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]">
          <label
            htmlFor="profilePictureInput"
            className="bg-[#A8C2C0] text-white border-none py-1.5 px-2.5 rounded cursor-pointer mx-2.5 my-2.5 transition-colors duration-300 flex-shrink-0 text-xs hover:bg-[#94AEAB]"
          >
            Choisir un fichier
          </label>
          <input
            type="file"
            id="profilePictureInput"
            name="profilePicture"
            onChange={handleProfilePictureChange}
            onBlur={formik.handleBlur}
            accept="image/*"
            className="absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] border-0"
          />
          <span className="text-xs text-gray-600 flex-grow text-left pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
            {profilePictureName}
          </span>
        </div>
        {formik.touched.profilePicture && formik.errors.profilePicture && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.profilePicture}
          </p>
        )}

        {/* Role Dropdown */}
        <div
          ref={dropdownRef}
          className={`relative w-full my-2 flex items-center bg-gray-100 rounded-lg shadow-inner transition-all duration-300 ease ${
            formik.touched.role && formik.errors.role
              ? "border border-red-400 shadow-red-200"
              : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)]"
          }`}
        >
          <Icon>💼</Icon>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => formik.setFieldTouched("role", true)}
            className={`bg-transparent border-none py-2.5 px-0 pr-9 w-full text-left cursor-pointer text-sm ${
              formik.values.role ? "text-gray-800" : "text-gray-500"
            } flex justify-between items-center rounded-lg focus:outline-none`}
          >
            <span>
              {formik.values.role
                ? roleOptions.find((opt) => opt.value === formik.values.role)
                    ?.label
                : "Activité"}
            </span>
            <span
              className={`ml-2.5 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              } text-gray-500 text-base pointer-events-none flex-shrink-0`}
            >
              ▼
            </span>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-25 overflow-y-auto mt-0.5">
              {roleOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleRoleSelect(option.value)}
                  className={`py-2 px-3 flex items-center cursor-pointer text-xs text-gray-800 transition-colors duration-200 rounded mx-1 my-0.5 ${
                    formik.values.role === option.value
                      ? "bg-[#A8C2C0] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2 text-sm w-4.5 flex justify-center">
                    {option.icon}
                  </span>
                  <span className="flex-1 text-xs">{option.label}</span>
                </li>
              ))}
            </div>
          )}
        </div>
        {formik.touched.role && formik.errors.role && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
        )}

        {/* Contact Phone (for association and company) */}
        {(formik.values.role === "association" ||
          formik.values.role === "company") && (
          <>
            <div
              className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
                formik.touched.contactPhone && formik.errors.contactPhone
                  ? "border-red-400 shadow-red-200"
                  : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
              }`}
            >
              <Icon>📞</Icon>
              <input
                type="tel"
                placeholder="Numéro de contact"
                name="contactPhone"
                value={formik.values.contactPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
              />
            </div>
            {formik.touched.contactPhone && formik.errors.contactPhone && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.contactPhone}
              </p>
            )}
          </>
        )}

        {/* Association Name */}
        {formik.values.role === "association" && (
          <>
            <div
              className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
                formik.touched.nameAsso && formik.errors.nameAsso
                  ? "border-red-400 shadow-red-200"
                  : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
              }`}
            >
              <Icon>🏢</Icon>
              <input
                type="text"
                placeholder="Nom de l'association"
                name="nameAsso"
                value={formik.values.nameAsso}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
              />
            </div>
            {formik.touched.nameAsso && formik.errors.nameAsso && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.nameAsso}
              </p>
            )}
          </>
        )}

        {/* Company Name */}
        {formik.values.role === "company" && (
          <>
            <div
              className={`relative w-full my-2 flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-inner transition-all duration-300 ease ${
                formik.touched.nameCompany && formik.errors.nameCompany
                  ? "border-red-400 shadow-red-200"
                  : "focus-within:shadow-[0_0_0_2px_rgba(165,194,192,0.5)] focus-within:border-bg-[#A8C2C0]"
              }`}
            >
              <Icon>🏭</Icon>
              <input
                type="text"
                placeholder="Nom de la société"
                name="nameCompany"
                value={formik.values.nameCompany}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-transparent border-none py-2.5 px-4 pr-0 w-full text-gray-800 text-sm focus:outline-none"
              />
            </div>
            {formik.touched.nameCompany && formik.errors.nameCompany && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.nameCompany}
              </p>
            )}
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`rounded-lg border border-bg-[#A8C2C0] bg-[#A8C2C0] text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition-all duration-300 ease-in-out mt-5 w-full max-w-[200px] ${
            formik.isSubmitting
              ? "bg-gray-400 border-gray-300 cursor-not-allowed"
              : "hover:bg-[#94AEAB] active:scale-95 focus:outline-none"
          }`}
        >
          {formik.isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>

        {/* Status Messages */}
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

export default SignUpPage;
