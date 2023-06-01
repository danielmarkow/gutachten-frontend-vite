import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "wouter";

export default function Landing() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <>
      <p>landing</p>
      {isAuthenticated ? (
        <>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
          <br />
          <Link href="/gutachten">
            <a>Meine Gutachten</a>
          </Link>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </>
  );
}
