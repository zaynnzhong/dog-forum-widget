import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaComments, FaCamera, FaPaw } from 'react-icons/fa';

const NavContainer = styled.nav`
  background: ${props => props.theme.colors.white};
  padding: 1rem 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  
  span {
    margin-left: 0.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 1rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: ${props => props.theme.colors.black};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

function Navigation() {
  return (
    <NavContainer>
      <Logo>
        🐕 <span>DogLovers Forum</span>
      </Logo>
      
      <NavLinks>
        <StyledNavLink to="/forum">
          <FaComments /> Forum
        </StyledNavLink>
        <StyledNavLink to="/photos">
          <FaCamera /> Photo Booth
        </StyledNavLink>
      </NavLinks>
      
      <WelcomeSection>
        <FaPaw /> Welcome to the Pack!
      </WelcomeSection>
    </NavContainer>
  );
}

export default Navigation;