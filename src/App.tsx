import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from 'styled-components';
import { NoticeList } from './components/NoticeList';
import { NoticeEditor } from './components/NoticeEditor';
import { TiptapEditor } from './components/TiptapEditor';

const queryClient = new QueryClient();

const Container = styled.div`
  padding: 20px;
`;

const Nav = styled.nav`
  text-align: center;
  margin-bottom: 20px;
`;

const NavButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${props => props.$active ? '#FA0050' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? '#d1003f' : '#e9ecef'};
  }
`;

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'tiptap'>('list');

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Nav>
          <NavButton 
            $active={currentView === 'list'}
            onClick={() => setCurrentView('list')}
          >
            공지사항 보기
          </NavButton>
          <NavButton 
            $active={currentView === 'editor'}
            onClick={() => setCurrentView('editor')}
          >
            CKEditor 작성
          </NavButton>
          <NavButton 
            $active={currentView === 'tiptap'}
            onClick={() => setCurrentView('tiptap')}
          >
            Tiptap 작성
          </NavButton>
        </Nav>
        
        {currentView === 'list' && <NoticeList />}
        {currentView === 'editor' && <NoticeEditor />}
        {currentView === 'tiptap' && <TiptapEditor />}
      </Container>
    </QueryClientProvider>
  );
}

export default App;