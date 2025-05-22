// Este script busca os filmes populares da API TMDb, obtém o trailer do YouTube para os cinco primeiros, formata os dados e salva em um arquivo JSON.
import dotenv from "dotenv";
dotenv.config();
import { writeFileSync, mkdirSync } from "fs"
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

class Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  link?: string;

  constructor(id: number, title: string, release_date: string, overview: string, link?: string) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.overview = overview;
    this.link = link;
  }
}

class VideoDetails {
  key: string;
  site: string;
  type: string;

  constructor(
    key: string,
    site: string,
    type: string,
  ) {
    this.key = key;
    this.site = site;
    this.type = type;
  }
}

async function fetchPopularMovies(apiKey: string): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/popular?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Find the popular movies and sort them by release date
    const popularMovies = await response.json();
    const sortedMovies = popularMovies.results.sort((a: Movie, b: Movie) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());


    const movies = sortedMovies.map((movie: Movie) => {
      const releaseDate = new Date(movie.release_date);
      const formattedDate = `${releaseDate.getDate().toString().padStart(2, '0')}/${(releaseDate.getMonth() + 1).toString().padStart(2, '0')}/${releaseDate.getFullYear()}`;

      const formattedMovie: Movie = new Movie(
        movie.id,
        movie.title,
        formattedDate,
        movie.overview,
      );
      return formattedMovie;
    })

    return movies;
  } catch (error: any) {
    console.error("Error fetching popular movies:", error.message);
    return [];
  }
}

// Return the first trailer for a movie
async function getMovieTrailer(movieId: number, apiKey: string): Promise<VideoDetails | undefined> {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const videos = data.results;
    // Find the first trailer
    const trailer = videos.find((video: VideoDetails) => video.type === "Trailer" && video.site === "YouTube");
    if (trailer) {
      return new VideoDetails(trailer.key, trailer.site, trailer.type);
    }
    return undefined;
  } catch (error: any) {
    console.error(`Error fetching trailers for movie ${movieId}:`, error.message);
    return undefined;
  }
}

async function getPopularMovies() {
  const movies = (await fetchPopularMovies(API_KEY)).slice(0, 6);

  for (let n = 0; n < 5; n++) {
    const trailer = await getMovieTrailer(movies[n].id, API_KEY);
    movies[n].link = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined;
  }
  console.log(movies);
  mkdirSync("results", { recursive: true });
  writeFileSync("results/movies.json", JSON.stringify(movies, null, 2));


}

getPopularMovies()
