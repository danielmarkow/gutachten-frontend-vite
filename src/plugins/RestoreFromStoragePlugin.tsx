import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";

import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";

import { debounce } from "../utils/debounce";

export function RestoreFromStoragePlugin({ namespace }: { namespace: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  const saveContentMut = useMutation({
    mutationFn: async ({ ga }: { ga: EditorState }) => {
      await axios.put("http://localhost:8000/api/gutachten/" + namespace, {
        ga,
      });
    },
    onError: () => {
      console.error("something went wrong updating the remote storage");
    },
  });

  const editorContentQuery = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:8000/api/gutachten/" + namespace
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
        if (Object.keys(data).length > 0) {
          const initialEditorState = editor.parseEditorState(data.ga);
          editor.setEditorState(initialEditorState);
        }
      }
    },
  });

  const debouncedSaveContent = debounce(saveContentMut.mutate, 1000);

  const onChange = (editorState: EditorState) => {
    debouncedSaveContent({ ga: editorState });
  };

  return <OnChangePlugin onChange={onChange} />;
}
