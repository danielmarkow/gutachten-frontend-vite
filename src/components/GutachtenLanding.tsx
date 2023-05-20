import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "wouter";
import type { GutachtenOutput } from "../types/gutachten";

export default function GutachtenLanding() {
  const [location, setLocation] = useLocation();

  const createGutachtenMut = useMutation({
    mutationFn: async () => {
      const resp = await axios.post("http://localhost:8000/api/gutachten", {
        ga: {
          root: {
            children: [
              {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            type: "root",
            version: 1,
          },
        },
      });
      return resp.data as GutachtenOutput;
    },
    onSuccess: (data) => {
      setLocation(`/gutachten/${data.id}`);
    },
  });

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
      <button onClick={() => createGutachtenMut.mutate()}>
        Neues Gutachten
      </button>
    </>
  );
}
