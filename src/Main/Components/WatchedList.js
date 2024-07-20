

function WatchedList({ watched, setWatched }) {
    function deleteHandler(id){
      setWatched((prev)=> (prev.filter(movie => movie.imdbID!==id)));
    }
    return (
      <ul className="list">
        {watched.map((movie) => (
          <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
            </div>
            <button className="btn-delete" onClick={()=>deleteHandler(movie.imdbID)}>❌</button>
          </li>
        ))}
      </ul>
    );
  }

  export default WatchedList;