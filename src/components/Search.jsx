import React, { useEffect, useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageWrapper = styled.div`
  width: 100%;
  background: #fff;
  padding: 1rem;
  box-sizing: border-box;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  border: .0625rem solid #ccc;
  border-radius: 1.5625rem;
  padding: 0.4rem 0.8rem;
  background: #fff;
  margin-bottom: 1rem;
`;

const IconLeft = styled(FaSearch)`
  color: #666;
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #111;
`;

const ClearButton = styled(FaTimes)`
  color: #666;
  font-size: 1rem;
  cursor: pointer;
`;

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 48rem) {
    flex-direction: row; 
    align-items: flex-start;
  }
`;

const Sidebar = styled.aside`
  background: #fff;
  border-radius: .5rem;
  box-shadow: 0 .125rem .3125rem rgba(0,0,0,0.06);
  border: .0625rem solid #e8e8e8;
  padding: 1rem;

  @media (min-width: 48rem) {
    flex: 0 0 16.25rem;
    max-width: 16.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #01b4e4;
  padding: 0.5rem 1rem;
  border-radius: .375rem;
  margin: 0 0 1rem;
`;

const SidebarList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem;
    border-radius: .5rem;
    background: #f7fbfd;
    border: .0625rem solid #e6f4fa;
    color: #0a2a43;
    font-size: 0.95rem;

    & + li {
      margin-top: 0.5rem;
    }

    .count {
      background: #eaf7fc;
      border: .0625rem solid #d7eef8;
      color: #0a2a43;
      font-weight: 600;
      padding: 0.1rem 0.5rem;
      border-radius: 62.4375rem;
      font-size: 0.85rem;
      min-width: 2rem;
      text-align: center;
    }
  }
`;

const ResultsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MovieCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.9rem;
  background: #f4f4f4;
  border-radius: .625rem;
  border: .0625rem solid #e9e9e9;
  align-items: flex-start;
`;

const Poster = styled.img`
  width: 5rem;
  height: 7.5rem;
  object-fit: cover;
  border-radius: .375rem;
  flex-shrink: 0;

  @media (min-width: 48rem) {
    width: 6.25rem;
    height: 9.375rem;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0; 
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.25rem;
  line-height: 1.2;
`;

const Meta = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.4rem;
`;

const Overview = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;     
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ---------- Pagination ---------- */
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;

  button {
    border: none;
    background: none;
    font-size: 1rem;
    cursor: pointer;
    color: #111; /* Dark text */
    padding: 0.3rem 0.5rem;
    border-radius: .375rem;

    &:disabled {
      color: #ccc;
      cursor: default;
    }

    &.active {
      background: #ddd;
      font-weight: 700;
    }
  }

  span {
    color: #888;
  }
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: .0625rem solid #ddd;
  border-radius: .5rem;
  max-height: 15.625rem;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 999;
`;

const SuggestionItem = styled.li`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    background: #f2f2f2;
  }
`;

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const formRef = useRef(null); 

  useEffect(() => {
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setSuggestions([]); // close dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const page = parseInt(params.get("page") || "1", 10);
    setQuery(q);
    setTerm(q);
    setCurrentPage(page);
  }, [location.search]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    const fetchMovies = async () => {
      try {
        const apiKey = "e696906ce9132324a4d3854c9723b87b";
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&page=${currentPage}`;

        const res = await fetch(url);
        if (!res.ok) {
          console.error("TMDB error:", await res.json());
          return;
        }
        const data = await res.json();
        setResults(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, [query, currentPage]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term)}&page=1`);
    }
  };
  const clearInput = () => {
    setTerm("");
    setResults([]);
    setTotalPages(1);
    navigate(`/search?q=&page=1`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];

    const createPage = (num) => (
      <button
        key={num}
        onClick={() =>
          navigate(`/search?q=${encodeURIComponent(query)}&page=${num}`)
        }
        className={num === currentPage ? "active" : ""}
      >
        {num}
      </button>
    );

    pages.push(
      <button
        key="prev"
        onClick={() =>
          navigate(`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`)
        }
        disabled={currentPage === 1}
      >
        ← Previous
      </button>
    );

    if (currentPage > 2) pages.push(createPage(1));
    if (currentPage > 3) pages.push(<span key="dots1">…</span>);
    if (currentPage > 1) pages.push(createPage(currentPage - 1));

    pages.push(createPage(currentPage));

    if (currentPage < totalPages) pages.push(createPage(currentPage + 1));
    if (currentPage + 2 < totalPages) pages.push(<span key="dots2">…</span>);
    if (currentPage + 1 < totalPages) pages.push(createPage(totalPages));

    pages.push(
      <button
        key="next"
        onClick={() =>
          navigate(`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`)
        }
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    );

    return <Pagination>{pages}</Pagination>;
  };

  useEffect(() => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
  
    const fetchSuggestions = async () => {
      try {
        const apiKey = "e696906ce9132324a4d3854c9723b87b";
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
          term
        )}&page=1`;
  
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    };
  
    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [term]);
  

  return (
    <PageWrapper>
      <form ref={formRef} onSubmit={handleSubmit} style={{ position: "relative" }}>
        <SearchBarWrapper>
          <IconLeft />
          <Input
            type="text"
            placeholder="Search movies..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          {term && <ClearButton onClick={clearInput} />}
        </SearchBarWrapper>

        {suggestions.length > 0 && (
          <SuggestionList>
            {suggestions.slice(0, 6).map((s) => (
              <SuggestionItem
                key={s.id}
                onClick={() =>
                  navigate(`/search?q=${encodeURIComponent(s.name || s.title)}&page=1`)
                }
              >
                {s.name || s.title}
              </SuggestionItem>
            ))}
          </SuggestionList>
        )}
      </form>
      <ResultsWrapper>
        <Sidebar>
          <SectionTitle>Search Results</SectionTitle>
          <SidebarList>
            <li>
              <span>Movies</span>
              <span className="count">{results.length}</span>
            </li>
          </SidebarList>
        </Sidebar>
       
<ResultsList>
  {results.length > 0 ? (
    <>
      {results.map((movie) => (
        <Link
          key={movie.id}
          to={`/movie/${movie.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MovieCard>
            <Poster
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.title}
            />
            <CardContent>
              <Title>{movie.title}</Title>
              <Meta>
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString()
                  : "—"}
              </Meta>
              <Overview>{movie.overview || "No overview available."}</Overview>
            </CardContent>
          </MovieCard>
        </Link>
      ))}

      {renderPagination()}
    </>
  ) : query ? (
    <p>No results found for “{query}”.</p>
  ) : null}
</ResultsList>
      </ResultsWrapper>
    </PageWrapper>
  );
}
