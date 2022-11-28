interface ListenPodFile {
  url: string;
}

interface Program {
  id: number;
  name: string;
}

export interface Episode {
  id: number;
  title: string;
  description: string;
  url: string;
  listenpodfile: ListenPodFile;
  publishdateutc: string;
  program: Program;
}

/**
 * This interface is not complete, the actual response will contain more data, but irrelevant for this application
 */
export interface Episodes {
  episodes: Episode[];
}
