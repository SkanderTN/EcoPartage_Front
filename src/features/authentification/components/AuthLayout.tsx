// src/features/authentification/components/AuthLayout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  signIn: boolean;
  onSignInToggle: (value: boolean) => void;
}

const AuthLayout = ({ children, signIn, onSignInToggle }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen w-screen p-5 box-border bg-gray-100">
      {/* Container principal */}
      <div className="bg-white rounded-[10px] shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] relative overflow-hidden w-[800px] max-w-full min-h-[550px]">
        {children}

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-[100] ${
            !signIn ? "transform -translate-x-full" : ""
          }`}
        >
          <div
            className={`bg-[#A8C2C0] text-white relative -left-full h-full w-[200%] transform translate-x-0 transition-transform duration-500 ease-in-out ${
              !signIn ? "transform translate-x-1/2" : ""
            }`}
          >
            {/* Panneau gauche : "Se connecter" */}
            <div
              className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transform -translate-x-1/5 transition-transform duration-500 ease-in-out ${
                !signIn ? "transform translate-x-0" : ""
              }`}
            >
              {/* Logo pour overlay gauche */}
              <div className="mb-5 w-full flex justify-center items-center absolute top-2.5 right-27">
                <img
                  src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png"
                  alt="ÉcoPartage Logo"
                  className="max-w-[150px] h-auto"
                />
              </div>

              <h1 className="text-xl font-bold m-0 text-white">
                Bienvenue de nouveau !
              </h1>
              <p className="text-base font-thin leading-5 tracking-wider my-5 mx-0 mb-7">
                Pour rester connecté avec nous, veuillez vous connecter avec vos
                informations personnelles.
              </p>
              <button
                className="rounded-lg border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition-all duration-300 ease-in-out hover:bg-[#94AEAB] hover:bg-opacity-20 active:scale-95 focus:outline-none"
                onClick={() => onSignInToggle(true)}
              >
                Se connecter
              </button>
            </div>

            {/* Panneau droit : "S'inscrire" */}
            <div
              className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 right-0 transform translate-x-0 transition-transform duration-500 ease-in-out ${
                !signIn ? "transform translate-x-1/5" : ""
              }`}
            >
              {/* Logo pour overlay droit */}
              <div className="mb-5 w-full flex justify-center items-center absolute top-2.5 right-27">
                <img
                  src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png"
                  alt="ÉcoPartage Logo"
                  className="max-w-[150px] h-auto"
                />
              </div>

              <h1 className="text-xl font-bold m-0 text-white">Bonjour, ami(e) !</h1>
              <p className="text-base font-thin leading-5 tracking-wider my-5 mx-0 mb-7">
                Entrez vos informations personnelles et commencez votre aventure
                avec nous.
              </p>
              <button
                className="rounded-lg border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition-all duration-300 ease-in-out hover:bg-[#94AEAB] hover:bg-opacity-20 active:scale-95 focus:outline-none"
                onClick={() => onSignInToggle(false)}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
