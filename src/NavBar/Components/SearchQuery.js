
function SearchQuery({setQuery,query}) {
  // const [name,setName] = useState("");
  function QueryHandler(e){
    setQuery(e.target.value);
  }
  return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={QueryHandler}
      />
    
  );
}

export default SearchQuery;
