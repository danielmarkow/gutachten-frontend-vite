import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";

import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { debounce } from "../utils/debounce";

export function RestoreFromStoragePlugin({ namespace }: { namespace: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { getAccessTokenSilently, user } = useAuth0();

  const saveContentMut = useMutation({
    mutationFn: async ({ ga }: { ga: EditorState }) => {
      const accessToken = await getAccessTokenSilently();
      await fetch(import.meta.env.VITE_API_DOMAIN + "gutachten/" + namespace, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: user?.sub, ga }),
      });
    },
    onError: () => {
      console.error("something went wrong updating the remote storage");
    },
  });

  useQuery({
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently();
      const res = await axios.get(
        import.meta.env.VITE_API_DOMAIN + "gutachten/" + namespace,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data;
    },
    enabled: namespace !== undefined,
    onError: () => {
      console.error("error retrieving gutachten data");
    },
    onSuccess: (data) => {
      if (isFirstRender) {
        setIsFirstRender(false);
        const initialEditorState = editor.parseEditorState(data[0].ga);
        editor.setEditorState(initialEditorState);
      }
    },
  });

  const debouncedSaveContent = debounce(saveContentMut.mutate, 1000);

  const onChange = (editorState: EditorState) => {
    debouncedSaveContent({ ga: editorState });
  };

  return <OnChangePlugin onChange={onChange} />;
}
