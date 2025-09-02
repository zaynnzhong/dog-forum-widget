import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Navigation from './components/Navigation';
import Forum from './components/Forum';
import PhotoBooth from './components/PhotoBooth';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.secondary};
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <AppContainer className="widget-container">
          <Navigation />
          <MainContent>
            <Routes>
              <Route path="/" element={<Navigate to="/forum" replace />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/photos" element={<PhotoBooth />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;