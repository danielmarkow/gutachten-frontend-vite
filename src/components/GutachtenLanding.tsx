import { useState } from "react";

import axios from "axios";
import { useQuery } from "react-query";
// import { Link } from "wouter";
import type { GutachtenOutput } from "../types/gutachten";
import CreateGutachtenModal from "./CreateGutachtenModal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useLocation } from "wouter";

import { useAuth0 } from "@auth0/auth0-react";

export default function GutachtenLanding() {
  const { getAccessTokenSilently } = useAuth0();
  const setLocation = useLocation()[1];

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
      <div className="grid gap-2  sm:grid-cols-2">
        {getGutachtenQuery.isSuccess &&
          getGutachtenQuery.data.map((gutachten) => (
            <div key={gutachten.id} className="flex justify-center h-full">
              <div className="flex p-1 flex-1 bg-white rounded-md border border-gray-200 w-52">
                <div className="flex gap-2 align-middle">
                  <PencilSquareIcon
                    onClick={() => setLocation(`/gutachten/${gutachten.id}`)}
                    className="h-5 w-5 cursor-pointer"
                  />
                  <TrashIcon className="h-5 w-5 cursor-pointer" />
                  <span>
                    {gutachten.description !== ""
                      ? gutachten.description
                      : "Keine Beschreibung"}
                  </span>
                </div>
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
