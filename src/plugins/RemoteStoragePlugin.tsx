import { useEffect } from "react";

import axios from "axios";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorState } from "lexical";
import { useMutation } from "react-query";

import { debounce } from "../utils/debounce";

type RemoteStoragePluginProps = {
  namespace: string;
};

export function RemoteStoragePlugin({ namespace }: RemoteStoragePluginProps) {
  const [editor] = useLexicalComposerContext();

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

  const debouncedSaveContent = debounce(saveContentMut.mutate, 1000);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
        debouncedSaveContent({ ga: editorState });
      }
    );
  }, [editor]);

  return null;
}
