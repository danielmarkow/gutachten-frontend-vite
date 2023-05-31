export type GradeInput = {
  grade: number;
  snippet: string;
  theme_id: string;
};

export type GradeOutput = GradeInput & {
  id: string;
  user_id: string;
};

export type ThemeInput = {
  theme: string;
  differentiation: string;
  color?: string;
};

export type ThemeOutput = ThemeInput & {
  id: string;
  grades: GradeOutput[];
  user_id: string;
};
