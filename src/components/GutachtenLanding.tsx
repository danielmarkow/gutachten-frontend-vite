import { useState } from "react";

import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "wouter";
import type { GutachtenOutput } from "../types/gutachten";
import CreateGutachtenModal from "./CreateGutachtenModal";

import { useAuth0 } from "@auth0/auth0-react";

export default function GutachtenLanding() {
  const { getAccessTokenSilently } = useAuth0();

  const [openCreateGA, setOpenCreateGA] = useState(false);

  const getGutachtenQuery = useQuery({
    queryKey: ["gutachten"], // query key is necessary for this to refetch
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      const res = await axios.get(
        import.meta.env.VITE_API_DOMAIN + "gutachten",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data as GutachtenOutput[];
    },
    onError: () => {
      console.error("error retrieving gutachten data");
    },
  });

  if (getGutachtenQuery.isLoading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div className="h-2" />
      <CreateGutachtenModal open={openCreateGA} setOpen={setOpenCreateGA} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {getGutachtenQuery.isSuccess &&
          getGutachtenQuery.data.map((gutachten) => (
            <div
              key={gutachten.id}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
            >
              <div className="min-w-0 flex-1">
                <Link href={`/gutachten/${gutachten.id}`}>
                  <a className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {gutachten.description}
                    </p>
                  </a>
                </Link>
              </div>
            </div>
          ))}
      </div>
      <div className="h-2" />
      <button
        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        onClick={() => setOpenCreateGA(true)}
      >
        Neues Gutachten
      </button>
    </>
  );
}
