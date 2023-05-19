import axios from "axios";
import { useMutation } from "react-query";
import { useLocation } from "wouter";

export default function GutachtenLanding() {
  const [location, setLocation] = useLocation();

  const createGutachtenMut = useMutation({
    mutationFn: async () => {
      const resp = await axios.post("http://localhost:8000/api/gutachten", {
        ga: {},
      });
      return resp.data;
    },
    onSuccess: (data) => {
      setLocation(`/gutachten/${data.id}`);
    },
  });

  return (
    <>
      <p>Deine Gutachten</p>
      <button onClick={() => createGutachtenMut.mutate()}>
        Neues Gutachten
      </button>
    </>
  );
}
