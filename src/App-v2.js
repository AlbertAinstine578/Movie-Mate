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

const KEY = process.env.REACT_APP_OMDB_API_KEY;


export default function App2() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function(){
    const item = JSON.parse(localStorage.getItem('watched')) || [];
    return item;
  });
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
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("⛔️No Movie in the list!");
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
