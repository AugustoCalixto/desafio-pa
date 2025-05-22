// Este script busca os filmes atualmente em cartaz nos cinemas utilizando a API do The Movie Database (TMDb)
// ( NELE EXISTE O SCRIPT DE RETORNAR APENAS A QUANTIDADE DE VOTOS DO FILMES ESPECIFICO), e salva a lista de filmes em um arquivo JSON local.
import dotenv from "dotenv";
dotenv.config();
import { mkdirSync, writeFileSync } from "fs";
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

class Movie {
    id: number;
    title: string;
    release_date: string;
    overview: string;
    vote_average: number;
    poster_path?: string;

    constructor(id: number, title: string, release_date: string, overview: string, vote_average: number, poster?: string) {
        this.id = id;
        this.title = title;
        this.release_date = release_date;
        this.overview = overview;
        this.vote_average = vote_average;
        this.poster_path = poster;
    }
}

async function fetchTheaterMovies(): Promise<Movie[]> {
    const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
    const data = await fetch(url);
    const theaterMovies = await data.json();
    const formattedMovies = await Promise.all(
        theaterMovies.results.map(async (movie: Movie) => {
            const releaseDate = new Date(movie.release_date);
            const formattedDate = `${releaseDate.getDate().toString().padStart(2, '0')}/${(releaseDate.getMonth() + 1).toString().padStart(2, '0')}/${releaseDate.getFullYear()}`;
            const formattedMovie = new Movie(
                movie.id,
                movie.title,
                formattedDate,
                movie.overview,
                movie.vote_average,
                movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined
            )
            return formattedMovie;
        })
    );

    if (data.status !== 200) {
        throw new Error(`Error fetching movies: status ${data.status}`);
    }
    if (theaterMovies.length === 0) {
        throw new Error(`No movies found`);
    }

    return formattedMovies
}

async function findVoteCount(movieId: number): Promise<number> {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const data = await fetch(url);
    const movieDetails = await data.json();
    if (data.status !== 200) {
        throw new Error(`Error fetching movie details: status ${data.status}`);
    }
    if (!movieDetails.vote_count) {
        throw new Error(`No vote count found for movie ID ${movieId}`);
    }
    return movieDetails.vote_count;
}


async function main() {
    try {
        const movies = await fetchTheaterMovies();
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const voteCount = await findVoteCount(randomMovie.id);
        const movieDetails = {
            title: randomMovie.title,
            release_date: randomMovie.release_date,
            overview: randomMovie.overview,
            vote_average: randomMovie.vote_average,
            vote_count: voteCount,
            poster_path: randomMovie.poster_path,
        };
        console.log(movieDetails);

        const dir = './results';
        mkdirSync(dir, { recursive: true });
        const filePath = `${dir}/now-playing.json`;
        writeFileSync(filePath, JSON.stringify(movies, null, 2));

    } catch (error) {
        console.error(error);
    }
}

main();