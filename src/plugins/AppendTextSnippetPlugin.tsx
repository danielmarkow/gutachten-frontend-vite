import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import axios from "axios";
import { createCommand, COMMAND_PRIORITY_LOW } from "lexical";
import type { LexicalCommand } from "lexical";

import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { useQuery } from "react-query";

export function AppendTextSnippedPlugin() {
  const [editor] = useLexicalComposerContext();
  const APPEND_TEXT_SNIPPET_COMMAND: LexicalCommand<string> = createCommand();

  editor.registerCommand(
    APPEND_TEXT_SNIPPET_COMMAND,
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

  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/theme");
      return res.data;
    },
  });

  return (
    <>
      {themeQuery.isSuccess &&
        themeQuery.data.map((tb) => (
          <div key={tb.id}>
            <p>{tb.theme}</p>
            <p>{tb.differentiation}</p>
            {tb.grades.map((grade) => (
              <button
                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() =>
                  editor.dispatchCommand(
                    APPEND_TEXT_SNIPPET_COMMAND,
                    grade.snippet
                  )
                }
              >
                Note {grade.grade}
              </button>
            ))}
          </div>
        ))}
    </>
  );
}
