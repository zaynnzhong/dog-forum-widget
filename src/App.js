import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import ForumReorganized from './components/ForumReorganized';
import PhotoBooth from './components/PhotoBooth';
import styled from 'styled-components';
import { FaComments, FaCamera } from 'react-icons/fa';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(151deg, #f5e8d7, #fdfbf6 46%, #f5e8d7);
  overflow-y: auto;
`;

const TabContainer = styled.div`
  display: flex;
  background: ${props => props.theme.colors.white};
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
  padding: 0;
  margin-bottom: 2rem;
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

const HeaderSection = styled.div`
  text-align: center;
  padding: 2rem 1rem 0;
  background: transparent;
`;

const HeaderTitle = styled.h2`
  text-align: center;
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin: 0;
  font-size: 3.5rem;
  font-family: 'Switzer', sans-serif;
  font-weight: 600;
  background: linear-gradient(90deg, #3c2e26 72%, #f66220);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeaderSubtitle = styled.p`
  text-align: center;
  padding-bottom: 4rem;
  padding-top: 1rem;
  font-size: 1.2rem;
  font-weight: 400;
  color: #3c2e26;
  line-height: 1.5;
  letter-spacing: -0.01em;
  opacity: 0.72;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding-bottom: 1.5rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0 20px 20px;
  background: transparent;
`;

function App() {
  const [activeTab, setActiveTab] = useState('forum');

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <HeaderSection>
          <HeaderTitle>
            Dog Community Forum
            <br />
            Ask & Share
          </HeaderTitle>
          <HeaderSubtitle>Connect with fellow dog parents, share experience, and get expert advice</HeaderSubtitle>
        </HeaderSection>
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
          {activeTab === 'forum' ? <ForumReorganized /> : <PhotoBooth />}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;