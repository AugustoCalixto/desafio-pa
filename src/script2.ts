// Este script busca gêneros de filmes que começam com "A" na API TMDb, seleciona o terceiro gênero, busca filmes desse gênero e salva os resultados em um arquivo JSON.
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
    poster_path?: string;
    vote_average: number;

    constructor(id: number, title: string, release_date: string, overview: string, vote_average: number, poster?: string) {
        this.id = id;
        this.title = title;
        this.release_date = release_date;
        this.overview = overview;
        this.vote_average = vote_average;
        this.poster_path = poster;
    }
}

class Genres {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

async function fetchGenresStartingWithA(): Promise<Genres[]> {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`
    const res = await fetch(url)

    if (res.status !== 200) {
        throw new Error(`Erro ao buscar gêneros: status ${res.status}`)
    }

    const data = await res.json()
    const genres = data.genres.filter((genre: Genres) => genre.name.startsWith("A"))
    return genres
}

async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR`;
    const res = await fetch(url);

    if (res.status !== 200) {
        throw new Error(`Erro ao buscar filmes: status ${res.status}`);
    }

    const data = await res.json();
    return data.results.map(
        (movie: any) =>
            new Movie(
                movie.id,
                movie.title,
                movie.release_date,
                movie.overview,
                movie.vote_average,
                `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            )
    );
}

// log genders and the movies filtred by the third gender from the list
async function main() {
    const genres = await fetchGenresStartingWithA()
    console.log(genres)
    const movies = await fetchMoviesByGenre(genres[2].id)
    console.log(movies)

    mkdirSync("./results", { recursive: true })
    writeFileSync("./results/animation-movies.json", JSON.stringify(movies, null, 2))
    console.log("Movies saved to movies.json")
}
main()