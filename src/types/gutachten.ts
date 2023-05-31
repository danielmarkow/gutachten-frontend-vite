import type { EditorState } from "lexical";

export type GutachtenOutput = {
  id: string;
  ga: EditorState;
  description: string;
  user_id: string;
};
