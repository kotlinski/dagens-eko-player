export interface EpisodesApiResponse {
  copyright: string;
  episodes: EpisodeApiResponse[];
  pagination: Pagination;
}

export interface EpisodeApiResponse {
  id: number;
  title: string;
  description: string;
  url: string;
  program: Program;
  audiopreference: string;
  audiopriority: string;
  audiopresentation: string;
  availableuntilutc?: string;
  publishdateutc: string;
  imageurl: string;
  imageurltemplate: string;
  photographer?: string;
  broadcast?: Broadcast;
  broadcasttime?: Broadcasttime;
  listenpodfile?: Listenpodfile;
  downloadpodfile?: Downloadpodfile;
  channelid?: number;
}

interface Program {
  id: number;
  name: string;
}

interface Broadcast {
  playlist: Playlist;
  broadcastfiles: Broadcastfile[];
  availablestoputc?: string;
}

interface Playlist {
  duration: number;
  publishdateutc: string;
  id: number;
  url: string;
  statkey: string;
}

interface Broadcastfile {
  duration: number;
  publishdateutc: string;
  id: number;
  url: string;
  statkey: string;
}

interface Broadcasttime {
  starttimeutc: string;
  endtimeutc: string;
}

interface Listenpodfile {
  title: string;
  description: string;
  filesizeinbytes: number;
  program: Program;
  availablefromutc: string;
  duration: number;
  publishdateutc: string;
  id: number;
  url: string;
  statkey: string;
}

interface Downloadpodfile {
  title: string;
  description: string;
  filesizeinbytes: number;
  program: Program;
  availablefromutc: string;
  duration: number;
  publishdateutc: string;
  id: number;
  url: string;
  statkey: string;
}

interface Pagination {
  page: number;
  size: number;
  totalhits: number;
  totalpages: number;
  nextpage: string;
}
