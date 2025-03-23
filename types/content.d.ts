export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

export type SearchResult = Movie | TVShow | Person;