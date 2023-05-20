import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import axios from "axios";
import { createCommand, COMMAND_PRIORITY_LOW } from "lexical";
import type { LexicalCommand } from "lexical";

import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useQuery } from "react-query";

import { TextbausteineOutput } from "../types/textbausteine";

export function AppendTextSnippedPlugin() {
  const [editor] = useLexicalComposerContext();
  const HELLO_WORLD_COMMAND: LexicalCommand<string> = createCommand();

  editor.registerCommand(
    HELLO_WORLD_COMMAND,
    (payload: string) => {
      editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(payload);
        paragraphNode.append(textNode);
        root.append(paragraphNode);
      });
      return true;
    },
    COMMAND_PRIORITY_LOW
  );

  const textbausteineQuery = useQuery({
    queryKey: ["textbausteine"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/textbaustein");
      return res.data as TextbausteineOutput[];
    },
  });

  return (
    <>
      {textbausteineQuery.isSuccess &&
        textbausteineQuery.data.map((tb) => (
          <div key={tb.id}>
            <p>{tb.theme}</p>
            <p>{tb.differentiation}</p>
            <p>{tb.grade}</p>
            <button
              onClick={() =>
                editor.dispatchCommand(HELLO_WORLD_COMMAND, tb.snippet)
              }
            >
              Note {tb.grade}
            </button>
          </div>
        ))}
    </>
    // <button
    //   onClick={() => editor.dispatchCommand(HELLO_WORLD_COMMAND, "hrello")}
    // >
    //   dispatch
    // </button>
  );
}
