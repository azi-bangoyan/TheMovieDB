// src/pages/Movies.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import NoPosterSVG from "../assets/no-photo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaChevronDown, FaTimes } from "react-icons/fa";

const Wrapper = styled.div`
  padding: 1.25rem;
  padding-bottom: 6.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 25rem;
  margin: 0 auto;

  @media (min-width: 48rem) {
    flex-direction: row;
    max-width: 87.5rem;
    gap: 2rem;
    margin: 0 auto;
  }
`;

const LeftPanel = styled.div`
  width: 100%;

  @media (min-width: 48rem) {
    width: 20%;
  }
`;

const RightPanel = styled.div`
  width: 100%;

  @media (min-width: 48rem) {
    width: 80%;
  }
`;

const SearchWrapper = styled.div`
  margin-top: 1rem;
  @media (min-width: 48rem) {
    margin-top: 1.25rem;
  }
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: black;
  font-weight: 700;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.3rem;
`;

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  padding: 0.875rem 1rem;
  width: 100%;
  background-color: transparent;
  color: black;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0.0625rem solid rgb(227, 227, 227);
  box-shadow: rgba(0, 0, 0, 0.1) 0 0.125rem 0.5rem 0;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  width: 100%;
  font-weight: 300;
  background-color: white;
  border: 0.0625rem solid rgb(227, 227, 227);
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  display: ${({ open }) => (open ? "block" : "none")};
  padding: 0.75rem;
  margin-top: -0.3125rem;
`;

const DropdownItem = styled.div`
  padding: 0.625rem;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SecondDropdownButton = styled.button`
  padding: 0.5rem 0.75rem;
  width: 100%;
  font-weight: 300;
  background-color: #dee2e6;
  color: black;
  font-size: 0.95rem;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const SecondDropdownMenu = styled.div`
  position: absolute;
  top: 110%;
  width: 100%;
  max-height: 15rem;
  overflow-y: auto;
  overflow-x: hidden;
  left: 0;
  z-index: 1;
  background-color: #ffffff;
  font-weight: 300;
  border: 0.0625rem solid rgb(227, 227, 227);
  border-radius: 0.375rem;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const GenreButton = styled.button`
  background-color: ${({ active }) =>
    active ? "rgb(1,180,228)" : "transparent"};
  color: ${({ active }) => (active ? "white" : "black")};
  border: 0.0625rem solid
    ${({ active }) => (active ? "rgb(1,180,228)" : "#9e9e9e")};
  border-radius: 0.875rem;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:focus {
    outline: none;
  }
`;

const FilterLabel = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.625rem;
  color: #333;
`;

const Divider = styled.div`
  height: 0.0625rem;
  background-color: #ccc;
  width: calc(100% + 1.6rem);
  margin: 0.75rem -0.8rem;
`;

const SearchButton = styled.button`
  width: 100%;
  font-size: 1.1875rem;
  padding: 0.625rem 0.9375rem;
  background-color: rgb(1, 180, 228);
  color: white;
  border: none;
  border-radius: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:disabled {
    opacity: 1;
    color: rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const KeywordInput = styled.input`
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 0.0625rem solid rgb(200, 200, 200);
  border-radius: 0.375rem;
  font-size: 0.9rem;
  box-sizing: border-box;
`;

const SmallSpinner = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: conic-gradient(#555 0% 80%, transparent 80% 100%);
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 0.0625rem),
    black 0
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 0.0625rem),
    black 0
  );
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    0% {
      transform: translateY(-50%) rotate(0deg);
    }
    100% {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`;

const ClearIcon = styled(FaTimes)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const MovieList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 48rem) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9.75rem, 1fr));
    gap: 2rem;
  }
`;

const MovieRow = styled.div`
  display: flex;
  align-items: stretch;
  height: 8.9rem;
  border: 0.0625rem solid #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.03) 0 0.0625rem 0.1875rem;

  @media (min-width: 48rem) {
    flex-direction: column;
    height: auto;
    border: none;
    height: 25rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0.125rem 0.5rem;
    border-radius: 0.75rem;
  }
`;

const PosterWrap = styled.div`
  position: relative;
  width: 6.25rem;
  height: 100%;
  flex-shrink: 0;
  overflow: visible;

  @media (min-width: 48rem) {
    width: 100%;
    height: 18.75rem;
  }
`;

const RowPoster = styled.img`
  width: 6.25rem;
  height: 100%;
  object-fit: cover;
  display: block;

  @media (min-width: 48rem) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PosterFallback = styled.div`
  width: 6.25rem;
  height: 100%;
  flex-shrink: 0;
  background-color: #dbdbdb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7a7a7a;
  font-size: 0.6875rem;

  svg,
  img {
    width: 1.875rem;
    height: 1.875rem;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 48rem) {
    width: 100%;
    height: 100%;
  }
`;

const RatingBadgeWrap = styled.div`
  display: none;

  @media (min-width: 48rem) {
    --deg: 0deg;
    --color: #21d07a;
    position: absolute;
    left: 0.5rem;
    bottom: -1.25rem;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    padding: 0.1875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: conic-gradient(
      var(--color) var(--deg),
      rgba(255, 255, 255, 0.06) var(--deg)
    );
    z-index: 4;
  }
`;

const RatingInner = styled.div`
  display: none;

  @media (min-width: 48rem) {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #081c22;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    padding: 0.3125rem;
    font-size: 0.8125rem;
    color: #fff;
    sup {
      font-size: 0.55em;
      vertical-align: super;
      margin-left: 0.0625rem;
    }
  }
`;

const RowInfo = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow: hidden;

  @media (min-width: 48rem) {
    justify-content: flex-start;
    padding: 1rem;
  }
`;

const RowTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 48rem) {
    white-space: normal;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    margin-top: 1.25rem;
  }
`;

const RowMeta = styled.p`
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  margin: 0.375rem 0 0 0;

  @media (min-width: 48rem) {
    margin: 0.25rem 0;
  }
`;

const RowOverview = styled.p`
  margin: 1.5rem 0 0 0;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.1;
  max-height: 2.2em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const TopLoadingBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 0.25rem;
  background: rgb(1, 180, 228);
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
  z-index: 9999;
`;

const StickySearchWrapper = styled.div`
  position: fixed;
  bottom: ${({ position }) => (position === "bottom" ? "0" : "0rem")};
  left: 0;
  width: 100%;
  padding: 0.25rem 1rem;
  background: rgb(1, 180, 228);
  box-shadow: ${({ position }) =>
    position === "bottom"
      ? "0 -0.125rem 0.375rem rgba(0,0,0,0.15)"
      : "0 0.125rem 0.625rem rgba(0,0,0,0.25)"};
  z-index: 999;
  transition: all 0.2s ease;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  font-size: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: rgb(1, 180, 228);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: 48rem) {
    width: 100%;
    margin-top: 2rem;
  }
`;

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.625rem;
  background: white;
  border: 0.0625rem solid #ddd;
  border-radius: 0.5rem;
  max-height: 12.5rem;
  overflow-y: auto;
  position: absolute;
  width: 93%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

export default function Movies() {
  const [sortOpen, setSortOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedSort, setSelectedSort] = useState("Popularity Descending");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [infiniteActive, setInfiniteActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const searchButtonRef = useRef(null);
  const [stickyPosition, setStickyPosition] = useState(null);
  const navigate = useNavigate();

  const API_KEY =
    import.meta.env?.VITE_TMDB_API_KEY || "e696906ce9132324a4d3854c9723b87b";

  const defaultSort = "Popularity Descending";
  const sortMap = {
    "Popularity Descending": "popularity.desc",
    "Popularity Ascending": "popularity.asc",
    "Rating Descending": "vote_average.desc",
    "Rating Ascending": "vote_average.asc",
    "Release Date Descending": "release_date.desc",
    "Release Date Ascending": "release_date.asc",
    "Title (A-Z)": "original_title.asc",
    "Title (Z-A)": "original_title.desc",
  };

  const tmdbGenres = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
  };

  const genres = Object.keys(tmdbGenres);
  const isSortChanged = selectedSort !== defaultSort;
  const canSearch =
    selectedGenres.length > 0 || keyword.trim() !== "" || isSortChanged;
  const canShowSticky = stickyPosition && canSearch;

  useEffect(() => {
    if (!searchButtonRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          const nearBottom =
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 80;
          setStickyPosition(nearBottom ? "bottom" : "floating");
        } else {
          setStickyPosition(null);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(searchButtonRef.current);
    return () => observer.disconnect();
  }, []);

  const fetchMovies = async (nextPage = 1) => {
    if (!API_KEY) {
      console.warn("No TMDB API key set.");
      return;
    }

    let url = "";
    if (keyword.trim()) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        keyword
      )}&language=en-US&page=${nextPage}`;
    } else {
      const genreIds = selectedGenres.length
        ? selectedGenres.map((g) => tmdbGenres[g]).join(",")
        : "";
      const sortBy = sortMap[selectedSort] || "popularity.desc";
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sortBy}&page=${nextPage}`;
      if (genreIds) url += `&with_genres=${genreIds}`;
    }

    try {
      setLoading(true);
      setLoadingProgress(20);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 400);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`TMDB error: ${res.status}`);
      }
      const data = await res.json();

      if (nextPage === 1) {
        setMovies(data.results || []);
        setPage(1);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
        setPage(nextPage);
      }

      clearInterval(interval);
      setLoadingProgress(100);
      setTimeout(() => setLoadingProgress(0), 500);
    } catch (err) {
      console.error(err);
      setLoadingProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!API_KEY || query.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    try {
      setSuggestionLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&language=en-US&page=1`
      );
      if (!res.ok) {
        throw new Error("Suggestion fetch failed");
      }
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSearch = () => {
    if (loading) return;
    setInfiniteActive(false);
    fetchMovies(1);
  };

  const loadMore = () => {
    if (loading) return;
    if (!infiniteActive) setInfiniteActive(true);
    fetchMovies(page + 1);
  };

  useEffect(() => {
    if (!infiniteActive) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !loading
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [infiniteActive, loading, page]);

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const computeBadgeStyle = (vote_average) => {
    const percent = vote_average ? Math.round(vote_average * 10) : 0;
    const degree = Math.min(Math.max(percent, 0), 100) * 3.6 + "deg";
    let ringColor;
    if (percent < 30) ringColor = "#db2360";
    else if (percent < 70) ringColor = "#d2d531";
    else ringColor = "#21d07a";
    return { percent, degree, ringColor };
  };

  return (
    <>
      {loadingProgress > 0 && <TopLoadingBar progress={loadingProgress} />}
      <Wrapper>
        <LeftPanel>
          <Title>Popular Movies</Title>
          <DropdownContainer>
            <DropdownWrapper>
              <DropdownButton
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFiltersOpen(false);
                }}
              >
                Sort {sortOpen ? <FaChevronDown /> : <FaChevronRight />}
              </DropdownButton>
              <DropdownMenu open={sortOpen}>
                <SecondDropdownButton
                  onClick={() => setResultOpen(!resultOpen)}
                >
                  {selectedSort}{" "}
                  {resultOpen ? <FaChevronDown /> : <FaChevronRight />}
                </SecondDropdownButton>
                <SecondDropdownMenu open={resultOpen}>
                  {Object.keys(sortMap).map((opt) => (
                    <DropdownItem
                      key={opt}
                      onClick={() => {
                        setSelectedSort(opt);
                        setResultOpen(false);
                      }}
                    >
                      {opt}
                    </DropdownItem>
                  ))}
                </SecondDropdownMenu>
              </DropdownMenu>
            </DropdownWrapper>

            <DropdownWrapper>
              <DropdownButton onClick={() => setFiltersOpen(!filtersOpen)}>
                Filters {filtersOpen ? <FaChevronDown /> : <FaChevronRight />}
              </DropdownButton>

              <DropdownMenu open={filtersOpen}>
                <FilterLabel>Genres</FilterLabel>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {genres.map((genre) => (
                    <GenreButton
                      key={genre}
                      active={selectedGenres.includes(genre)}
                      onClick={() => {
                        if (selectedGenres.includes(genre)) {
                          setSelectedGenres(
                            selectedGenres.filter((g) => g !== genre)
                          );
                        } else {
                          setSelectedGenres([...selectedGenres, genre]);
                        }
                      }}
                    >
                      {genre}
                    </GenreButton>
                  ))}
                </div>

                <Divider />

                <FilterLabel>Keywords</FilterLabel>
                <InputWrapper>
                  <KeywordInput
                    placeholder="Filter by keywords"
                    value={keyword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setKeyword(val);
                      fetchSuggestions(val);
                    }}
                  />
                  {suggestionLoading ? (
                    <SmallSpinner />
                  ) : keyword ? (
                    <ClearIcon
                      onClick={() => {
                        setKeyword("");
                        setSuggestions([]);
                      }}
                    />
                  ) : null}
                </InputWrapper>

                {suggestions.length > 0 && (
                  <SuggestionsList>
                    {suggestions.slice(0, 8).map((s) => (
                      <SuggestionItem
                        key={s.id}
                        onClick={() => {
                          setKeyword(s.name);
                          setSuggestions([]);
                        }}
                      >
                        {s.name}
                      </SuggestionItem>
                    ))}
                  </SuggestionsList>
                )}
              </DropdownMenu>
            </DropdownWrapper>
          </DropdownContainer>

          <SearchWrapper ref={searchButtonRef}>
            <SearchButton
              onClick={handleSearch}
              disabled={loading || !canSearch}
            >
              {loading && page === 1 ? (
                <>
                  <SmallSpinner /> Searching…
                </>
              ) : (
                "Search"
              )}
            </SearchButton>
          </SearchWrapper>

          {canShowSticky && (
            <StickySearchWrapper position={stickyPosition}>
              <SearchButton
                onClick={handleSearch}
                disabled={loading || !canSearch}
              >
                {loading && page === 1 ? (
                  <>
                    <SmallSpinner /> Searching…
                  </>
                ) : (
                  "Search"
                )}
              </SearchButton>
            </StickySearchWrapper>
          )}
        </LeftPanel>

        <RightPanel>
          <MovieList>
            {movies.map((m) => {
              const { percent, degree, ringColor } = computeBadgeStyle(
                m.vote_average
              );
              return (
                <Link
                  key={m.id}
                  to={`/movie/${m.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MovieRow>
                    <PosterWrap>
                      {m.poster_path ? (
                        <RowPoster
                          src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                          alt={m.title || m.name}
                        />
                      ) : (
                        <PosterFallback>
                          <img src={NoPosterSVG} alt="No Poster" />
                        </PosterFallback>
                      )}
                      <RatingBadgeWrap
                        style={{ ["--deg"]: degree, ["--color"]: ringColor }}
                        aria-hidden={false}
                        title={`${percent}%`}
                      >
                        <RatingInner>
                          {percent}
                          <sup>%</sup>
                        </RatingInner>
                      </RatingBadgeWrap>
                    </PosterWrap>
                    <RowInfo>
                      <RowTitle>{m.title || m.name}</RowTitle>
                      <RowMeta>
                        {m.release_date
                          ? new Date(m.release_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </RowMeta>
                      <RowOverview>{m.overview}</RowOverview>
                    </RowInfo>
                  </MovieRow>
                </Link>
              );
            })}
          </MovieList>

          <LoadMoreButton onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </LoadMoreButton>
        </RightPanel>
      </Wrapper>
    </>
  );
}
