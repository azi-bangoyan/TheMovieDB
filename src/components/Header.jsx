// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "../assets/logo-mobile.svg";
import logoDesktop from "../assets/logo-desk.svg";
import { FaBars, FaTimes, FaBell, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const HeaderWrapper = styled.div`
  width: 100%;
  background-color: rgb(3, 37, 65);
  display: flex;
  justify-content: center;
  z-index: 20;
`;

const HeaderContainer = styled.header`
  width: 100%;
  max-width: 87.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  background-color: rgb(3, 37, 65);
  box-sizing: border-box;
  position: relative;
  z-index: 20;

  @media (min-width: 48rem) {
    padding: 0.625rem 2.5rem;
  }
`;

const LogoImg = styled.img`
  width: 3.4375rem;
  position: absolute;
  z-index: 3;
  right: 43%;
  top: 20%;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const LogoImgDesktop = styled.img`
  display: none;

  @media (min-width: 48rem) {
    display: block;
    height: 1.25rem;
    position: static;
    padding-right: 1.375rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  position: relative;
  z-index: 3;
`;

const MenuIcon = styled.button`
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 1.25rem;
  z-index: 3;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const BellIcon = styled.button`
  background: none;
  border: none;
  display: flex;
  padding-right: 0.625rem;
  align-items: center;
  cursor: pointer;
  font-size: 1.125rem;
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: rgb(1, 180, 228);
  margin-left: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.6rem;
  text-transform: uppercase;
`;

const PlusButton = styled.button`
  display: none;

  @media (min-width: 48rem) {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const LanguageButton = styled.button`
  display: none;

  @media (min-width: 48rem) {
    display: block;
    background-color: transparent;
    border: 0.0625rem solid white;
    border-radius: 0.25rem;
    color: white;
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;

    &:hover {
      color: rgb(3, 37, 65);
      background-color: white;
    }
  }
`;

const SearchToggleBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  color: rgb(1, 180, 228);
`;

const SideMenu = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 85%;
  background: rgb(3, 37, 65);
  opacity: 0.9;
  backdrop-filter: blur(1.25rem);
  transform: translateX(${({ open }) => (open ? "0" : "-100%")});
  transition: transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1);
  box-shadow: 0.125rem 0 0.75rem rgba(0, 0, 0, 0.12);
  padding-left: 1.25rem;
  display: flex;
  z-index: 1;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 48rem) {
    position: static;
    height: auto;
    width: auto;
    background: none;
    opacity: 1;
    transform: none;
    box-shadow: none;
    padding-left: 0;
    flex-direction: row;
    z-index: 22;
    align-items: center;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  padding-top: 4.5rem;
  display: flex;
  font-weight: 600;
  flex-direction: column;
  gap: 0.625rem;

  @media (min-width: 48rem) {
    padding-top: 0;
    align-items: center;
    flex-direction: row;
    gap: 2rem;
    white-space: nowrap;
  }
`;

const MenuItem = styled.li`
  position: relative;
  a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 400;
    font-size: 1.1875rem;
    display: block;

    @media (min-width: 48rem) {
      font-size: 0.875rem;
    }

    &:hover > ul {
      display: block;
    }
  }
  &.desktop-only {
    display: none;

    @media (min-width: 48rem) {
      display: block;
    }
  }
`;
const Dropdown = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0.3125rem;
  display: ${({ open }) => (open ? "block" : "none")};

  li a {
    color: white;
    text-decoration: none;
    padding: 0.625rem;
    font-size: 0.875rem;
    font-weight: 400;
    padding: 0;
    line-height: 2.5rem;
    display: block;
  }

  @media (min-width: 48rem) {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: #ffffff;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    display: none;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);

    li a {
      color: #212529;
      text-decoration: none;
      display: block;
      padding: 0.75rem 0.9375rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 0.5rem;
    }
    ${MenuItem}:hover & {
      display: block;
      border: 0.0625rem solid rgba(33, 37, 41, 0.2);
      border-radius: 0.25rem;
      padding: 0;
      width: 9.6875rem;
      padding: 0.3125rem;
    }
  }
`;

const SubMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9375rem;

  li a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    display: block;
    padding: 0;
    line-height: 1.75rem;
  }
  li:last-child a {
    padding-top: 0.75rem;
  }

  @media (min-width: 48rem) {
    display: none;
  }
`;
/* ---------- full-bleed search dropdown ---------- */
const SearchDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  z-index: 22;
  pointer-events: auto;
`;

const SearchFullPanel = styled.div`
  width: 100%;
  background: white;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
`;

const SearchInner = styled.div`
  max-width: 87.5rem;
  margin: 0 auto;
  padding: 0 1.25rem;
  box-sizing: border-box;
  border: 0.0625rem solid #e6e6e6;

  @media (min-width: 48rem) {
    padding: 0 1rem;
    border: none;
    max-width: 81.25rem;
  }
`;

const SearchPanel = styled.div`
  background: #fff;
  border-radius: 0;
  padding: 0.625rem;

  @media (min-width: 48rem) {
    padding: 0;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 0;
  overflow: hidden;
  background: #fff;

  @media (min-width: 48rem) {
    height: 3.125rem;
    padding: 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 0.6rem 0.75rem 0.6rem 2.25rem;
  font-size: 0.9375rem;
  color: #111;

  @media (min-width: 48rem) {
    height: 3.125rem;
  }
`;

const SearchInputIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  font-size: 1rem;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  max-height: 12rem;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: #212529;
  background: ${(p) => (p.active ? "rgba(1,180,228,0.08)" : "transparent")};

  &:hover {
    background: rgba(1, 180, 228, 0.06);

    @media (min-width: 48rem) {
      margin-top: 9.875rem;
    }
  }
`;
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 15;
  display: ${({ open }) => (open ? "block" : "none")};

  @media (min-width: 48rem) {
    display: none;
  }
`;

const SuggestionIcon = styled(FaSearch)`
  font-size: 0.875rem;
  color: #212529;
`;

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // arrow navigation
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({
    movies: false,
    tv: false,
    people: false,
  });

  const toggleDropdown = (key) => {
    setDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // static suggestions fallback (you can replace or fetch from API)
  const suggestions = [
    "Avengers",
    "Batman",
    "Spider-Man",
    "Inception",
    "Interstellar",
    "The Matrix",
    "The Godfather",
    "Pulp Fiction",
    "Parasite",
  ];

  // refs for outside click & focusing
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // open focus behavior
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setSearchQuery("");
      setFiltered([]);
      setSelectedIndex(-1);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    // clear existing timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const q = (searchQuery || "").trim().toLowerCase();
      if (!q) {
        setFiltered([]);
        setLoading(false);
        setSelectedIndex(-1);
        return;
      }
      // filter static suggestions (replace with API call if needed)
      const res = suggestions.filter((s) => s.toLowerCase().includes(q));
      setFiltered(res);
      setLoading(false);
      setSelectedIndex(-1);
    }, 200); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchQuery, searchOpen]);

  useEffect(() => {
    function onDocClick(e) {
      if (!searchOpen) return;
      const node = dropdownRef.current;
      if (!node) return;
      if (!node.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e) {
      if (!searchOpen) return;
      if (e.key === "Escape") {
        setSearchOpen(false);
        return;
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const onInputKeyDown = (e) => {
    const len = filtered.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev + 1;
        return next >= len ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? Math.max(0, len - 1) : next;
      });
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < len) {
        const value = filtered[selectedIndex];
        setSearchQuery(value);
        setSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchQuery.trim()) {
        setSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };
  const onSuggestionClick = (value) => {
    setSearchQuery(value);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Link to="/">
          {" "}
          <LogoImgDesktop src={logoDesktop} alt="Logo" />
        </Link>{" "}
        <MenuIcon
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </MenuIcon>
        <Backdrop open={open} onClick={() => setOpen(false)} />
        <SideMenu open={open} aria-hidden={!open}>
          <MenuList>
            <MenuItem>
              <a
                href="#movies"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("movies");
                }}
              >
                Movies
              </a>
              <Dropdown open={dropdown.movies}>
                <li>
                  <Link to="/">Popular</Link>
                </li>
                <li>
                  <a href="#upcoming">Now Playing</a>
                </li>
                <li>
                  <a href="#upcoming">Upcoming</a>
                </li>
                <li>
                  <a href="#now-playing">Top Rated</a>
                </li>
              </Dropdown>
            </MenuItem>
            <MenuItem>
              <a
                href="#tv"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("tv");
                }}
              >
                TV Shows
              </a>
              <Dropdown open={dropdown.tv}>
                <li>
                  <a href="#popular-tv">Popular</a>
                </li>
                <li>
                  <a href="#airing-today">Top Rated</a>
                </li>
                <li>
                  <a href="#top-rated-tv">On TV</a>
                </li>
                <li>
                  <a href="#top-rated-tv">Airing Today</a>
                </li>
              </Dropdown>
            </MenuItem>

            <MenuItem>
              <a
                href="#people"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("people");
                }}
              >
                People
              </a>
              <Dropdown open={dropdown.people}>
                <li>
                  <a href="#popular-people">Popular People</a>
                </li>
              </Dropdown>
            </MenuItem>

            <MenuItem className="desktop-only">
              <a
                href="#more"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown("more");
                }}
              >
                More
              </a>
              <Dropdown open={dropdown.more}>
                <li>
                  <a href="#news">Discussions</a>
                </li>
                <li>
                  <a href="#contact">Leaderboard</a>
                </li>
                <li>
                  <a href="#support">Support</a>
                </li>
                <li>
                  <a href="#api">API Documantation</a>
                </li>
                <li>
                  <a href="#api">API for Business</a>
                </li>
              </Dropdown>
            </MenuItem>
          </MenuList>
          <SubMenuList>
            <li>
              <a href="#contribution">Contribution Bible</a>
            </li>
            <li>
              <a href="#discussions">Discussions</a>
            </li>
            <li>
              <a href="#leaderboard">Leaderboard</a>
            </li>
            <li>
              <a href="#api">API</a>
            </li>
            <li>
              <a href="#support">Support</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#logout">Log out</a>
            </li>
          </SubMenuList>
        </SideMenu>
        <Link to="/">
          {" "}
          <LogoImg src={logo} alt="Logo" />
        </Link>
        <IconContainer>
          <PlusButton>
            <FaPlus />
          </PlusButton>
          <LanguageButton>EN</LanguageButton>

          <BellIcon>
            <FaBell />
          </BellIcon>

          <UserAvatar>A</UserAvatar>

          <SearchToggleBtn
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => setSearchOpen((s) => !s)}
          >
            {searchOpen ? <FaTimes /> : <FaSearch />}
          </SearchToggleBtn>
        </IconContainer>
        {searchOpen && (
          <SearchDropdown ref={dropdownRef}>
            <SearchFullPanel>
              <SearchInner>
                <SearchPanel>
                  <SearchInputWrapper>
                    <SearchInput
                      ref={inputRef}
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={onInputKeyDown}
                      aria-autocomplete="list"
                      aria-expanded={filtered.length > 0}
                      aria-activedescendant={
                        selectedIndex >= 0
                          ? `suggestion-${selectedIndex}`
                          : undefined
                      }
                    />
                    <SearchInputIcon />
                  </SearchInputWrapper>

                  {loading && <div style={{ marginTop: 8 }}>Searching…</div>}

                  {!loading && filtered.length > 0 && (
                    <SuggestionsList
                      role="listbox"
                      aria-label="Search suggestions"
                    >
                      {filtered.map((s, idx) => (
                        <SuggestionItem
                          id={`suggestion-${idx}`}
                          key={s}
                          active={idx === selectedIndex}
                          role="option"
                          aria-selected={idx === selectedIndex}
                          onMouseDown={(ev) => {
                            ev.preventDefault();
                            onSuggestionClick(s);
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <SuggestionIcon />
                          {s}
                        </SuggestionItem>
                      ))}
                    </SuggestionsList>
                  )}
                  {!loading && searchQuery && filtered.length === 0 && (
                    <div
                      style={{ margin: 10, paddingBottom: 30, color: "#666" }}
                    >
                      No results
                    </div>
                  )}
                </SearchPanel>
              </SearchInner>
            </SearchFullPanel>
          </SearchDropdown>
        )}
      </HeaderContainer>
    </HeaderWrapper>
  );
}
