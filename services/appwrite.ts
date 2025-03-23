import { Client, Databases, ID, Query } from "react-native-appwrite";
import { Movie, TVShow, Person, SearchResult } from '@/types/content';

// Get environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID;
const USER_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID;

// Verify environment variables are defined
if (!DATABASE_ID || !COLLECTION_ID || !PROJECT_ID || !SAVED_MOVIES_COLLECTION_ID || !USER_COLLECTION_ID) {
  throw new Error('Missing required Appwrite configuration environment variables');
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

// Add type guards at the top of the file
const isMovie = (content: SearchResult): content is Movie => {
  return 'title' in content && 'release_date' in content;
};

const isTVShow = (content: SearchResult): content is TVShow => {
  return 'name' in content && 'first_air_date' in content;
};

const isPerson = (content: SearchResult): content is Person => {
  return 'name' in content && 'known_for_department' in content;
};

interface TrendingMovie {
  $id: string;
  searchTerm: string;
  content_id: number;
  title: string;
  content_type: 'movie' | 'tv' | 'person';
  count: number;
  poster_url: string;
}

export const updateSearchCount = async (query: string, content: SearchResult) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    const contentTitle = isMovie(content) ? content.title : content.name;
    const contentPath = isPerson(content) ? content.profile_path : content.poster_path;

    if (result.documents.length > 0) {
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        result.documents[0].$id,
        {
          count: result.documents[0].count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        content_id: content.id,
        title: contentTitle,
        content_type: isMovie(content) ? 'movie' : isPerson(content) ? 'person' : 'tv',
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${contentPath}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return undefined;
  }
};

interface SavedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export const saveMovie = async (movie: SavedMovie) => {
  try {
    await database.createDocument(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      }
    );
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const unsaveMovie = async (movieId: number) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("movie_id", movieId)]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID!,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error;
  }
};

export const getSavedMovies = async () => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID
    );
    return result.documents;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    throw error;
  }
};

export const isMovieSaved = async (movieId: number) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("movie_id", movieId)]
    );
    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking saved status:", error);
    return false;
  }
};

export const saveUserName = async (name: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.limit(1)]
    );

    if (result.documents.length > 0) {
      // Update existing name
      await database.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        result.documents[0].$id,
        { name }
      );
    } else {
      // Create new name document
      await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        { name }
      );
    }
  } catch (error) {
    console.error("Error saving user name:", error);
    throw error;
  }
};

export const getUserName = async (): Promise<string | null> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.limit(1)]
    );

    return result.documents.length > 0 ? result.documents[0].name : null;
  } catch (error) {
    console.error("Error getting user name:", error);
    return null;
  }
};

