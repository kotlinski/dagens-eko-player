// noinspection SpellCheckingInspection
export enum NewsProgramId {
  EKOT_MAIN_NEWS = 4540, // Ekot nyhetssändning
  EKOT_LATEST_NEWS = 5380, // Ekot senaste nytt
  EKOT_ECONOMY = 178, // Ekonomiekot
  EKOT_ONE_MINUTE_NEWS = 4880, // P3 Nyheter på en minut
  SCIENCE_NEWS = 406, // Vetenskapsradion Nyheter
  SPORT_NEWS = 2895, // Radiosportens nyhetssändningar
  CULTURE_NEWS = 478, // Kulturnytt i P1
}

export function getNewsProgramIds(): number[] {
  return [NewsProgramId.EKOT_MAIN_NEWS, NewsProgramId.EKOT_LATEST_NEWS, NewsProgramId.EKOT_ECONOMY];
}

export function getOtherNewsProgramIds(): number[] {
  return [NewsProgramId.SCIENCE_NEWS, NewsProgramId.SPORT_NEWS, NewsProgramId.CULTURE_NEWS];
}
