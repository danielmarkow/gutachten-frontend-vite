import axios from "axios";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RemoteStoragePlugin } from "../plugins/RemoteStoragePlugin";
import { useQuery } from "react-query";

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>["0"]["initialConfig"];
};

export function LexicalEditor(props: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={props.config}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <RemoteStoragePlugin namespace={props.config.namespace} />
    </LexicalComposer>
  );
}

const Placeholder = () => {
  return (
    <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
      Start writing...
    </div>
  );
};

export function Editor({ ga_id }: { ga_id: string }) {
  const editorContentQuery = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:8000/api/gutachten/" + ga_id
      );
      return res.data;
    },
    enabled: ga_id !== undefined,
    onError: () => {
      console.error("error retrieving gutachten data");
    },
  });

  return (
    <>
      {editorContentQuery.isSuccess && editorContentQuery.data && (
        <>
          {JSON.stringify(editorContentQuery.data.ga)}
          <div
            id="editor-wrapper"
            className={
              "relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2"
            }
          >
            <LexicalEditor
              config={{
                namespace: ga_id,
                // editorState: editorContentQuery.data.ga,
                theme: {
                  root: "p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black",
                  link: "cursor-pointer",
                  text: {
                    bold: "font-semibold",
                    underline: "underline",
                    italic: "italic",
                    strikethrough: "line-through",
                    underlineStrikethrough: "underlined-line-through",
                  },
                },
                onError: (error) => {
                  console.log(error);
                },
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
