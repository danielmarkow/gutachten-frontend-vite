import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";

export default function Landing() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const setLocation = useLocation()[1];

  return (
    <>
      <p className="text-xl font-semibold">
        Willkommen beim Gutachten Generator
      </p>
      {isAuthenticated ? (
        <div className="mt-1 flex gap-1">
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>

          <button
            onClick={() => setLocation("/gutachten")}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Meine Gutachten
          </button>
        </div>
      ) : (
        <button
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      )}
    </>
  );
}
