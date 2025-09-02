import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Forum from './components/Forum';
import PhotoBooth from './components/PhotoBooth';
import styled from 'styled-components';
import { FaComments, FaCamera } from 'react-icons/fa';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.secondary};
  border-radius: 16px;
  overflow: hidden;
`;

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.white};
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
  padding: 0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.black};
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
  }
  
  &:first-child {
    border-right: 1px solid ${props => props.theme.colors.secondary};
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: ${props => props.theme.colors.secondary};
`;

function App() {
  const [activeTab, setActiveTab] = useState('forum');

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <TabContainer>
          <Tab 
            $active={activeTab === 'forum'} 
            onClick={() => setActiveTab('forum')}
          >
            <FaComments /> Discussion Forum
          </Tab>
          <Tab 
            $active={activeTab === 'photos'} 
            onClick={() => setActiveTab('photos')}
          >
            <FaCamera /> Photo Booth
          </Tab>
        </TabContainer>
        <MainContent>
          {activeTab === 'forum' ? <Forum /> : <PhotoBooth />}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;