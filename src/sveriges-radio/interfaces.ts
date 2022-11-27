interface ListenPodFile {
  url: string;
}

export interface Episode {
  id: number;
  title: string;
  url: string;
  listenpodfile: ListenPodFile;
  publishdateutc: string;
}

/**
 * This interface is not complete, the actual response will contain more data, but irrelevant for this application
 */
export interface Episodes {
  episodes: Episode[];
}
