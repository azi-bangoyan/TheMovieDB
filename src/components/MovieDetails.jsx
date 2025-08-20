import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import VibeSick from "../assets/1emoji.svg";
import VibeMeh from "../assets/2emoji.svg";
import VibeLaugh from "../assets/3emoji.svg";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import ExpandSVG from "../assets/icon-expand.svg";



const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!API_KEY) {
      console.error("VITE_TMDB_API_KEY missing in .env");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,release_dates`
        );
        const data = await res.json();
        if (!cancelled) setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, [id]);

  if (loading) return <Blank>Loading…</Blank>;
  if (!movie || movie.success === false)
    return (
      <Blank>
        <div>Movie not found or API error</div>
        <Back onClick={() => navigate(-1)}>← Back</Back>
      </Blank>
    );

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date?.split?.("-")?.[0] || "N/A";
  const releaseFormatted = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";
  const genres = movie.genres?.map((g) => g.name).join(", ") || "—";
  const percent = movie.vote_average ? Math.round(movie.vote_average * 10) : 0;
  const trailer =
    movie.videos?.results?.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.type === "Teaser") &&
        (v.official || true)
    ) || null;

  const formatRuntime = (min) => {
    if (!min) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const novel = movie.credits?.crew?.find((c) =>
    ["Novel", "Author"].includes(c.job)
  );
  const screenplay = movie.credits?.crew?.filter((c) =>
    ["Screenplay", "Writer", "Screen story"].includes(c.job)
  );

  const degree = Math.min(Math.max(percent, 0), 100) * 3.6 + "deg";
  let ringColor;
  if (percent < 30) {
    ringColor = "#db2360";
  } else if (percent < 70) {
    ringColor = "#d2d531";
  } else {
    ringColor = "#21d07a";
  }

  const Details = (
    <>
      <TitleRow>
        <Title>
          {movie.title} <Year>({year})</Year>
        </Title>
      </TitleRow>

      <ScoreRow>
        <ScoreRing style={{ "--deg": degree, "--color": ringColor }}>
          <ScoreInner>
            {percent}
            <sup>%</sup>
          </ScoreInner>
        </ScoreRing>

        <ScoreText>
          <ScoreLabel>
            User
            <br />
            Score
          </ScoreLabel>

          <Vibes>
            <VibeIcon src={VibeSick} alt="sick" />
            <VibeIcon src={VibeMeh} alt="meh" />
            <VibeIcon src={VibeLaugh} alt="laugh" />
          </Vibes>

          <VibeCTA>
            |{" "}
            <VibeLink onClick={() => alert("Vibe UI placeholder")}>
              What's your <U>Vibe?</U>
            </VibeLink>{" "}
            <InfoIcon>
              <FaInfoCircle />
            </InfoIcon>
          </VibeCTA>
        </ScoreText>
      </ScoreRow>

      <Hr />
      <MetaRow>
        <MetaTop>
          <RatingBadge>
            {movie.certification || (movie.adult ? "R" : "PG-13")}
          </RatingBadge>

          <MetaText>
            {releaseFormatted} <Dot>•</Dot> {formatRuntime(movie.runtime)}{" "}
            <Dot>•</Dot>
            <Play
              onClick={() =>
                trailer
                  ? window.open(
                      `https://www.youtube.com/watch?v=${trailer.key}`,
                      "_blank"
                    )
                  : alert("Trailer not found")
              }
            >
              <FaPlay /> Play Trailer
            </Play>
          </MetaText>
        </MetaTop>

        <MetaGenres>{genres}</MetaGenres>
      </MetaRow>

      {movie.tagline && <Tagline>{movie.tagline}</Tagline>}

      <SectionTitle>Your data is deadly.</SectionTitle>
      <OverviewTitle>Overview</OverviewTitle>
      <Overview>{movie.overview}</Overview>

      <Crew>
        <CrewCol>
          <CrewName>{director?.name || "—"}</CrewName>
          <CrewJob>Director</CrewJob>
        </CrewCol>

        <CrewCol>
          <CrewName>{novel?.name || "—"}</CrewName>
          <CrewJob>Novel</CrewJob>
        </CrewCol>

        {screenplay?.slice(0, 4).map((c) => (
          <CrewCol key={c.credit_id || `${c.id}-${c.job}`}>
            <CrewName>{c.name}</CrewName>
            <CrewJob>{c.job}</CrewJob>
          </CrewCol>
        ))}
      </Crew>
    </>
  );

  return (
    <Page>
      <Hero backdrop={backdrop}>
        <HeroOverlay />
        <HeroContent>
        <PosterMiniWrap
  role="button"
  aria-label="View poster"
  onClick={() =>
    poster ? window.open(poster, "_blank", "noopener") : null
  }
>
  {poster ? (
    <>
      <PosterMini src={poster} alt={movie.title} />
      <PosterOverlay className="poster-overlay">
        <ExpandIcon src={ExpandSVG} alt="Expand" />
        <OverlayText>Expand</OverlayText>
      </PosterOverlay>
    </>
  ) : (
    <PosterFallback>No Poster</PosterFallback>
  )}
</PosterMiniWrap>



          <DesktopMain>{Details}</DesktopMain>
        </HeroContent>
      </Hero>

      <MobileMain>{Details}</MobileMain>
    </Page>
  );
}


const Page = styled.div`
  background: #121212;
  color: #fff;
  min-height: 100vh;
  font-family: "Inter", system-ui, -apple-system, "Helvetica Neue", Arial;
`;

const Hero = styled.div`
  position: relative;
  background-size: cover;
  background-position: center;
  filter: saturate(0.95) brightness(0.9);
  background-image: ${({ backdrop }) =>
    backdrop
      ? `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) 10%, rgba(31.5, 31.5, 31.5, 0) 70%), url(${backdrop})`
      : `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) 30%, rgba(31.5, 31.5, 31.5, 0) 70%)`};

  min-height: 11.875rem;

  @media (min-width: 48rem) {
    min-height: 36rem;
    display: flex;
    align-items: center;
  }
`;

const HeroOverlay = styled.div`
  display: none;
  @media (min-width: 48rem) {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.45),
      rgba(0, 0, 0, 0.85)
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;

  @media (min-width: 48rem) {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
    max-width: 75rem;
    margin: 0 auto;
    padding: 3rem 2rem;
  }
`;

const PosterMiniWrap = styled.div`
  position: relative;
  left: 0%;
  top: 20%;
  width: 5.625rem;
  height: 8.75rem;
  border-radius: 0.625rem;
  overflow: hidden;
  box-shadow: 0 1.125rem 2.5rem rgba(0, 0, 0, 0.6);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.6));
  border: 0.0625rem solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  will-change: transform, opacity;

  @media (min-width: 48rem) {
    position: relative;
    left: 0;
    top: 0;
    width: 22.3125rem;
    height: 33.5rem;
    flex-shrink: 0;
  }

  &:hover > img {
    transform: scale(1.03);
    filter: blur(.375rem) saturate(0.9);
    opacity: 0.85;
  }
  &:hover > .poster-overlay {
    opacity: 1;
    transform: translateY(0);
  }
`;


const PosterMini = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 280ms ease, filter 280ms ease, opacity 200ms ease;
  z-index: 1;
`;

const PosterOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transform: translateY(.25rem);
  transition: opacity 200ms ease, transform 200ms ease;
  pointer-events: none; 
  z-index: 2; 
`;

const ExpandIcon = styled.img`
  width: 1.6rem;
  height: 1.6rem;
  display: block;
  object-fit: contain;
  background: transparent;
  pointer-events: none;
  z-index: 3;
`;

const OverlayText = styled.div`
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  z-index: 3;
`;


const PosterFallback = styled.div`
  width: 100%;
  height: 100%;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;


const MobileMain = styled.div`
  max-width: 51.25rem;
  margin: 0 auto;
  padding: 4rem 1.25rem 7.5rem;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const DesktopMain = styled.div`
  display: none;

  @media (min-width: 48rem) {
    display: block;
    margin-top: 0;
    max-width: 51.25rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
  color: #fff;
  text-align: center;
`;

const Year = styled.span`
  font-weight: 400;
  opacity: 0.85;
  margin-left: 0.375rem;
  font-size: 0.9em;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin: 1.125rem 0;
  justify-content: center;
`;

const ScoreRing = styled.div`
  --deg: 0deg;
  --color: #21d07a;
  width: 2.8125rem;
  height: 2.8125rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1875rem;
  background: conic-gradient(
    var(--color, #21d07a) var(--deg),
    rgba(255, 255, 255, 0.06) var(--deg)
  );
  transition: background 700ms cubic-bezier(0.2, 0.9, 0.2, 1);
  box-shadow: 0 0.375rem 1.125rem rgba(0, 0, 0, 0.6);
`;

const ScoreInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #081c22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  padding: 0.3125rem;
  font-size: 0.9375rem;
  sup {
    font-size: 0.6em;
    vertical-align: super;
  }
`;

const ScoreText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
  color: #fff;
`;

const ScoreLabel = styled.div`
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1;
  text-align: left;
`;

const Vibes = styled.div`
  display: flex;
  align-items: center;
`;

const VibeIcon = styled.img`
  width: 2.125rem;
  height: 2.125rem;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 0.125rem 0.375rem rgba(0, 0, 0, 0.4));
`;

const VibeCTA = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VibeLink = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

const U = styled.span`
  text-decoration: underline;
  text-underline-offset: 0.25rem;
`;

const InfoIcon = styled.span`
  opacity: 0.9;
  display: inline-flex;
  margin-left: 0.25rem;
  vertical-align: middle;
`;

const Hr = styled.div`
  height: 0.0625rem;
  background: rgba(255, 255, 255, 0.06);
  margin: 0.625rem 0 1.125rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const MetaTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
`;

const RatingBadge = styled.div`
  border-radius: 0.3125rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.625rem;
  background: rgba(255, 255, 255, 0.02);
  font-weight: 700;
  font-size: 0.8125rem;
`;

const MetaText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.95);
`;

const Dot = styled.span`
  opacity: 0.6;
`;

const Play = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MetaGenres = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  text-align: center;
`;

const Tagline = styled.div`
  font-style: italic;
  opacity: 0.75;
  margin: 0.75rem 0 0.5rem;
  text-align: left;
  font-size: 0.875rem;
`;

const SectionTitle = styled.h2`
  margin: 0.5rem 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  opacity: 0.95;
  text-align: left;
`;

const OverviewTitle = styled.h3`
  margin: 0.5rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  text-align: left;
`;

const Overview = styled.p`
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.6;
  font-size: 0.9375rem;
  margin: 0 0 0.75rem;
  text-align: left;
`;

const Crew = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.125rem;
  margin-top: 1.125rem;
`;

const CrewCol = styled.div``;

const CrewName = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

const CrewJob = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
`;

const Blank = styled.div`
  min-height: 13.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  flex-direction: column;
`;

const Back = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  margin-top: 0.75rem;
  cursor: pointer;
`;
