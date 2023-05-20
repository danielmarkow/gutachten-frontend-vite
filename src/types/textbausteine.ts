export type TextbausteineInput = {
  theme: string;
  differentiation: string;
  grade: number;
  snippet: string;
};

export type TextbausteineOutput = TextbausteineInput & {
  id: string;
};
