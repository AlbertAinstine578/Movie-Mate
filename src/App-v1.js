import { useEffect, useState } from "react";
import NavBar from "./NavBar/NavBar";
import Main from "./Main/Main";
import Logo from "./NavBar/Components/Logo";
import SearchQuery from "./NavBar/Components/SearchQuery";
import NumResults from "./NavBar/Components/NumResults";
import Box from "./Main/Components/Box";
import MovieList from "./Main/Components/MovieList";
import Summary from "./Main/Components/Summary";
import WatchedList from "./Main/Components/WatchedList";
import MovieDetails from "./Main/Components/MovieDetails";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "7fb00797";

export default function App1() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [errorMssg, setErrorMssg] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);


  useEffect(() => {
    async function FetchMovies() {
      try {
        setMovies([]);
        setLoaded(false);
        setErrorMssg("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        const data = await res.json();
        console.log(data);
        if (data.Response === "False") {
          throw new Error("⛔️Movie not found!");
        } else {
          setMovies(data.Search);
          setLoaded(true);
        }
      } catch (err) {
        if (err.message === "Failed to fetch") {
          setErrorMssg("⛔️Something went wrong while fetching movies!");
        } else {
          setErrorMssg(err.message);
        }
      }
    }
    FetchMovies();
  }, [query]);

  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(1);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);

  return (
    <>
      <NavBar>
        <Logo />
        <SearchQuery query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          <MovieList
            error={errorMssg}
            loaded={loaded}
            movies={movies}
            setSelectedId={setSelectedId}
          />
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails selectedId={selectedId} KEY={KEY} setWatched={setWatched}  setSelectedId={setSelectedId} watched={watched} /> 
          ) : (
            <>
              <Summary
                avgImdbRating={avgImdbRating}
                avgUserRating={avgUserRating}
                avgRuntime={avgRuntime}
                watched={watched}
              />
              <WatchedList watched={watched} setWatched={setWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
