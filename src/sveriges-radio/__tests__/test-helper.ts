import { Episode } from '../episodes-provider/episode-interface';

function randomString(): string {
  return (Math.random() + 1).toString(36).substring(7);
}
export function mockEpisode(episode: Partial<Episode> | undefined): Episode {
  return {
    url: episode?.url ?? randomString(),
    publish_date: episode?.publish_date ?? new Date(),
    title: episode?.title ?? randomString(),
    program: episode?.program ?? { id: Math.floor(Math.random() * 100_000), name: randomString() },
    description: episode?.description ?? randomString(),
  };
}
