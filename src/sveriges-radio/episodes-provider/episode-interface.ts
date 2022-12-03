export interface Episode {
  title: string;
  url: string;
  publish_date: Date;
  description: string;
  program: Program;
}

interface Program {
  id: number;
  name: string;
}
