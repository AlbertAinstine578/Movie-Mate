import { useEffect, useRef, useState } from "react";
import StarRating from "../../StarRating";


function MovieDetails({ selectedId, KEY, setWatched, watched, setSelectedId }) {
  const [movieInfo, setMovieInfo] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [outsideSelected, setOutsideSelected] = useState(null);
  const [originalRating, setOriginalRating] = useState(null);
  const [isTop, setIsTop] = useState(movieInfo.imdbRating>8);
  const count = useRef(0);
  useEffect(function(){
    setIsTop(movieInfo.imdbRating>8);
  },[movieInfo.imdbRating]);


  useEffect(
    function () {
      async function getMovieDetails() {
        setLoaded(false);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovieInfo(data);
        setLoaded(true);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  function handleBack() {
    setSelectedId(null);
  }

  useEffect(function(){
    if(outsideSelected){
      count.current++;
    }
  },[outsideSelected]);


  function handleWatched() {

    const newMovie = {
      imdbID: selectedId,
      Poster: movieInfo.Poster,
      Title: movieInfo.Title,
      imdbRating: movieInfo.imdbRating,
      userRating: outsideSelected,
      runtime: Number(movieInfo.Runtime.split(" ").at(0)),
      clickCount : count.current
    };
    setWatched((prev) => {
      let isPresent = false;
      const updatedPrev = prev.map((movie) => {
        if (movie.imdbID === newMovie.imdbID) {
          isPresent = true;
          return { ...movie, userRating: newMovie.userRating };
        }
        return movie;
      });
      if (!isPresent) {
        return [...prev, newMovie];
      }
      return updatedPrev;
    });
    handleBack();
  }

  useEffect(function(){
    localStorage.setItem('watched',JSON.stringify(watched));
  },[watched]);


  useEffect(() => {
    const watchedMovie = watched.find((movie) => movie.imdbID === selectedId);
    if (watchedMovie) {
      setOutsideSelected(watchedMovie.userRating);
      setOriginalRating(watchedMovie.userRating);
    } else {
      setOutsideSelected(null);
      setOriginalRating(null);
    }
  }, [selectedId, watched]);



  useEffect(function(){
    if(!movieInfo.Title){
        return;
    }
    document.title = `MOVIE : ${movieInfo.Title}`;
    //Cleanup-function
    return function(){
        document.title = 'usePopcorn';
    }

  },[movieInfo]);
  

  return (
    <div className="details">
      {loaded ? (
        <>
          <header>
            <button onClick={handleBack} className="btn-back">
              ⬅
            </button>
            <img
              src={movieInfo.Poster}
              alt={`Poster of ${movieInfo.Title} movie`}
            />
            <div className="details-overview">
              <h2>{movieInfo.Title}</h2>
              <p>
                {movieInfo.Released} &bull; {movieInfo.Runtime}{" "}
              </p>
              <p>{movieInfo.Genre}</p>
              <p>⭐️ {movieInfo.imdbRating} IMDb rating </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                setOutsideSelected={setOutsideSelected}
                outsideSelected={outsideSelected}
              />
            </div>
            {outsideSelected > 0  && outsideSelected!==originalRating && (
              <button className="btn-add" onClick={handleWatched}>
                + Add to List
              </button>
            )}
            <p>{movieInfo.Plot}</p>
            <p>{movieInfo.Actors}</p>
            <p>Directed by {movieInfo.Director} </p>
          </section>
        </>
      ) : (
        <p className="loader">Loading....</p>
      )}
    </div>
  );
}

export default MovieDetails;
