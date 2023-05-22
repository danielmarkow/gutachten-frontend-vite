import { useState } from "react";

import axios from "axios";
import { useQuery } from "react-query";
import { useLocation } from "wouter";
import type { GutachtenOutput } from "../types/gutachten";
import CreateGutachtenModal from "./CreateGutachtenModal";

export default function GutachtenLanding() {
  const [location, setLocation] = useLocation();
  const [openCreateGA, setOpenCreateGA] = useState(false);

  const getGutachtenQuery = useQuery({
    queryKey: ["gutachten"], // query key is necessary for this to refetch
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/gutachten/");
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
      <CreateGutachtenModal open={openCreateGA} setOpen={setOpenCreateGA} />
      <p>Deine Gutachten</p>
      <ul>
        {getGutachtenQuery.isSuccess &&
          getGutachtenQuery.data &&
          getGutachtenQuery.data.map((ga) => {
            return (
              <li
                key={ga.id}
                onClick={() => setLocation(`/gutachten/${ga.id}`)}
                className="cursor-pointer underline"
              >
                {ga.description ? ga.description : "keine Beschreibung"}
              </li>
            );
          })}
      </ul>
      <button
        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        onClick={() => setOpenCreateGA(true)}
      >
        Neues Gutachten
      </button>
    </>
  );
}
