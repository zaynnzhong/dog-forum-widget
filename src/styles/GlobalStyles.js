import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.body};
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.white};
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input, textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .widget-container {
    max-width: 100%;
    height: 100%;
    min-height: 600px;
    background: ${props => props.theme.colors.secondary};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: ${props => props.theme.shadows.large};
  }
`;