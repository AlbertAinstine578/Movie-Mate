import { useEffect, useRef } from "react";

function SearchQuery({setQuery,query}) {
  // const [name,setName] = useState("");
  const InputEl = useRef(null);
  function QueryHandler(e){
    setQuery(e.target.value);
  }

  useEffect(function(){

    function callBack(e){
      if(document.activeElement===InputEl.current){
        return;
      }
      if(e.code==="Enter"){
        InputEl.current.focus();
        setQuery("");
      }
      return function(){
        document.removeEventListener('keydown',callBack);
      }
    }

    document.addEventListener('keydown',callBack);
    
  },[setQuery]);

  return (
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={QueryHandler}
        ref={InputEl}
      />
    
  );
}

export default SearchQuery;
