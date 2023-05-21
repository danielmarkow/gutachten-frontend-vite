export type GradeInput = {
  grade: number;
  snippet: string;
  theme_id: string;
};

export type GradeOutput = GradeInput & {
  id: string;
};

export type ThemeInput = {
  theme: string;
  differentiation: string;
};

export type ThemeOutput = ThemeInput & {
  id: string;
  grades: GradeOutput[];
};
