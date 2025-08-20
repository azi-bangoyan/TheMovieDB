import React from "react";
import styled from "styled-components";
import logoDesktop from "../assets/logo-footer.svg";

const FooterWrapper = styled.footer`
  background: radial-gradient(
    at 30% top,
    #031d33 0%,
    rgba(3, 37, 65, 1) 70%
  );
  color: white;
  padding: 2.5rem 1.25rem;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 49rem;
`;

/* Mobile stacked layout (default) */
const MobileStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 48rem) {
    display: none;
  }
`;

const DesktopGrid = styled.div`
  display: none;

  @media (min-width: 48rem) {
    display: grid;
    grid-template-columns: 10rem repeat(4, 1fr);
    gap: .3125rem;
    align-items: start;
    width: 100%;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
`;

const Logo = styled.img`
  width: 8.125rem;
  height: auto;
  object-fit: contain;
`;

const GreetingButton = styled.button`
  background: white;
  color: #235ea7;
  font-weight: 900;
  font-size: 1.05rem;
  padding: 0.5rem 1rem;
  width: 6.3rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 .375rem 1.125rem rgba(0, 0, 0, 0.18);
`;

const SectionTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 0.6rem 0;
  letter-spacing: .0375rem;
`;

const LinkItem = styled.a`
  display: block;
  font-size: 1rem;
  font-weight: 300;
  color: rgb(255, 255, 255);
  text-decoration: none;
  margin-bottom: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Column = styled.div``;

const BottomNote = styled.div`
  margin-top: 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
`;

const Footer = ({ userName }) => {
  const displayName = userName || "Azniv";

  const basics = [
    "About TMDB",
    "Contact Us",
    "Support Forums",
    "API Documentation",
    "System Status",
  ];

  const getInvolved = ["Contribution Bible", "Add New Movie", "Add New TV Show"];
  const community = ["Guidelines", "Discussions", "Leaderboard"];
  const legal = ["Terms of Use", "API Terms of Use", "Privacy Policy", "DMCA Policy"];

  return (
    <FooterWrapper>
      <Container>
        <MobileStack>
        <GreetingButton aria-label={`Hi ${displayName}`}>Hi {displayName}!</GreetingButton>
          <Column>
            <SectionTitle>THE BASICS</SectionTitle>
            {basics.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>GET INVOLVED</SectionTitle>
            {getInvolved.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>COMMUNITY</SectionTitle>
            {community.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>LEGAL</SectionTitle>
            {legal.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>
        </MobileStack>

        <DesktopGrid>
          <LeftColumn>
            <Logo src={logoDesktop} alt="TMDB Logo" />
            <GreetingButton aria-label={`Hi ${displayName}`}>Hi {displayName}!</GreetingButton>
          </LeftColumn>

          <Column>
            <SectionTitle>THE BASICS</SectionTitle>
            {basics.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>GET INVOLVED</SectionTitle>
            {getInvolved.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>COMMUNITY</SectionTitle>
            {community.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>

          <Column>
            <SectionTitle>LEGAL</SectionTitle>
            {legal.map((b) => (
              <LinkItem key={b} href="#">{b}</LinkItem>
            ))}
          </Column>
        </DesktopGrid>

        <BottomNote>Build a5873ca (9150)</BottomNote>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
