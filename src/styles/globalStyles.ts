import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    // Backgrounds variables
    --blue-900: #0f101b;
    --blue-700: #141925;
    --blue-500: #222939;
    --grey-500: #535c78;
    --grey-400: #959eb9;
    --grey-300: #8d96b0;
    --grey-200: #c2cceb;
    --orange: #f37441;
    --white: #ffffff;
    --red: #ff1744;
    --green: #00e676;

    // Text variables
    --text-blue: var(--blue-500);
    --text-grey: var(--grey-400);
    --text-white: var(--white);

    // Buttons variables
    --btn-color-disabled: #69718c;
    --btn-bg-active: #ed6c39;

    // Fonts variables
    --font-inter: Inter;
    --font-family-main: var(--font-inter), system-ui, Avenir, Helvetica, Arial, sans-serif;
    
    // Global styles
    font-size: 16px;
    font-family: var(--font-family-main);
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: var(--blue-700);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }

  @font-face {
    font-family: var(--font-inter);
    font-weight: 600;
    src: url(../assets/fonts/Inter-SemiBold.ttf) format('truetype');
  }

  @font-face {
    font-family: var(--font-inter);
    font-weight: 500;
    src: url(../assets/fonts/Inter-Medium.ttf) format('truetype');
  }

  @font-face {
    font-family: var(--font-inter);
    font-weight: 400;
    src: url(../assets/fonts/Inter-Regular.ttf) format('truetype');
  }

  // Base styles / resets
  body {
    margin: 0;
    padding: 0;
    min-width: 320px;
    min-height: 100vh;
  }

  ul, menu {
    margin: 0;
    padding: 0;

    li {
      list-style-type: none;
    }
  }
  
  // Typography styles
  h1 {
    font-family: var(--font-family-main);
    font-weight: 500;
    font-size: 1.5rem;
    color: var(--text-white);
  }
  
  ul,
  li {
    font-family: var(--font-family-main);
    font-weight: 400;
    font-size: 1rem;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;

    &:hover {
      color: #535bf2;
    }
  }
`;

export default GlobalStyles;
