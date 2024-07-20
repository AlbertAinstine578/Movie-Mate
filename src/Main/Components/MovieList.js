

function MovieList({error, movies, loaded, setSelectedId }) {
  function clickHandler(id){
    setSelectedId((prev)=>(
      prev===id ? null : id
    ));
  }

    return (
      <ul className="list list-movies">
        { loaded?movies?.map((movie) => (
          <li onClick={()=>clickHandler(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>🗓</span>
                <span>{movie.Year}</span>
              </p>
            </div>
          </li>
        )) : error!==""?<p className="error">{error}</p> : <p className="loader">Loading....</p>}
      </ul>
    );
  }

  export default MovieList;