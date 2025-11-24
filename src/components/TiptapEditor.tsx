import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import { Heading } from '@tiptap/extension-heading';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { noticeApi } from '../api/noticeApi';
import { CreateNoticeRequest, UpdateNoticeRequest } from '../types/notice';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #FA0050;
    box-shadow: 0 0 0 2px rgba(250,0,80,0.25);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
  margin-right: 16px;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const EditorContainer = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const ToolbarButton = styled.button.attrs({ type: 'button' })<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: ${props => props.$isActive ? '#007bff' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : '#495057'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$isActive ? '#0056b3' : '#e9ecef'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled(ToolbarButton)`
  width: auto;
  padding: 0 8px;
  gap: 4px;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 120px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button.attrs({ type: 'button' })<{ $isActive?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${props => props.$isActive ? '#f8f9fa' : 'transparent'};
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EditorWrapper = styled.div`
  .ProseMirror {
    padding: 16px;
    min-height: 200px;
    outline: none;
    font-size: 16px;
    line-height: 1.6;
    
    &:focus {
      outline: none;
    }
    
    p {
      margin: 0 0 16px 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    h1, h2, h3 {
      margin: 24px 0 16px 0;
      font-weight: 600;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    
    ul, ol {
      padding-left: 24px;
      margin: 16px 0;
    }
    
    li {
      margin: 4px 0;
    }
    
    blockquote {
      border-left: 4px solid #e1e5e9;
      padding-left: 16px;
      margin: 16px 0;
      font-style: italic;
      color: #6c757d;
    }
    
    code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
    }
    
    pre {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
      
      code {
        background: none;
        padding: 0;
      }
    }
    
    strong {
      font-weight: 600;
    }
    
    em {
      font-style: italic;
    }
    
    hr {
      border: none;
      border-top: 1px solid #e1e5e9;
      margin: 24px 0;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      
      td, th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        min-width: 1em;
        position: relative;
      }
      
      th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    
    mark {
      background-color: #ffeb3b;
      padding: 0.1em 0.2em;
      border-radius: 2px;
    }
    
    u {
      text-decoration: underline;
    }
    
    .has-focus {
      border-radius: 3px;
      box-shadow: 0 0 0 3px #68cef8;
    }
    
    [style*="font-size"] {
      line-height: 1.4;
    }
    
    .indent-1 { margin-left: 2em; }
    .indent-2 { margin-left: 4em; }
    .indent-3 { margin-left: 6em; }
    .indent-4 { margin-left: 8em; }
    .indent-5 { margin-left: 10em; }
  }
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  padding: 12px 24px;
  background-color: ${props => props.$loading ? '#6c757d' : '#FA0050'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  font-size: 16px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$loading ? '#6c757d' : '#d1003f'};
  }
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  background-color: ${props => props.$type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.$type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`;

interface TiptapEditorProps {
  noticeId?: number;
  onCancel?: () => void;
}

export const TiptapEditor = ({ noticeId, onCancel }: TiptapEditorProps) => {
  const [title, setTitle] = useState('');
  const [isExposed, setIsExposed] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [headingDropdown, setHeadingDropdown] = useState(false);
  const [alignDropdown, setAlignDropdown] = useState(false);
  
  const queryClient = useQueryClient();
  const isEditMode = !!noticeId;
  
  const { data: notice } = useQuery({
    queryKey: ['notice', noticeId],
    queryFn: () => noticeApi.getNotice(noticeId!),
    enabled: isEditMode
  });
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
      }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: '<p>여기에 내용을 작성해주세요...</p>',
  });
  
  useEffect(() => {
    if (notice && editor) {
      setTitle(notice.title);
      setIsExposed(notice.isExposed);
      editor.commands.setContent(notice.content);
    }
  }, [notice, editor]);

  const createMutation = useMutation({
    mutationFn: (data: CreateNoticeRequest) => noticeApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setTitle('');
      editor?.commands.clearContent();
      setIsExposed(true);
      setMessage({ type: 'success', text: '공지사항이 성공적으로 등록되었습니다.' });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: '공지사항 등록에 실패했습니다. 다시 시도해주세요.' });
      setTimeout(() => setMessage(null), 3000);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: UpdateNoticeRequest) => noticeApi.updateNotice(noticeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      queryClient.invalidateQueries({ queryKey: ['notice', noticeId] });
      setMessage({ type: 'success', text: '공지사항이 성공적으로 수정되었습니다.' });
      setTimeout(() => {
        setMessage(null);
        onCancel?.();
      }, 1500);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: '공지사항 수정에 실패했습니다. 다시 시도해주세요.' });
      setTimeout(() => setMessage(null), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML() || '';
    if (!title.trim() || !content.trim()) return;
    
    const data = {
      title,
      content,
      isExposed: isExposed.toString()
    };
    
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!editor) return null;

  return (
    <Container>
      <Title>{isEditMode ? '공지사항 수정 (Tiptap)' : '공지사항 작성 (Tiptap)'}</Title>
      {message && (
        <Message $type={message.type}>
          {message.text}
        </Message>
      )}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <TitleInput
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        
        <InputGroup>
          <RadioGroup>
            <CheckboxLabel>
              <Checkbox
                type="radio"
                name="visibility"
                checked={isExposed === true}
                onChange={() => setIsExposed(true)}
              />
              공개
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="radio"
                name="visibility"
                checked={isExposed === false}
                onChange={() => setIsExposed(false)}
              />
              비공개
            </CheckboxLabel>
          </RadioGroup>
        </InputGroup>

        <EditorContainer>
          <Toolbar>
            {/* 기본 포매팅 */}
            <ToolbarGroup>
              <ToolbarButton
                $isActive={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                $isActive={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                $isActive={editor.isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                $isActive={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-3.01c0-.31-.05-.59-.15-.85-.29-.86-1.2-1.28-2.25-1.28-1.86 0-2.34 1.02-2.34 1.7 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.21-.34-.54-.89-.54-1.92zM21 12v2H3v-2h18zM12.56 15c1.1.18 1.9.39 2.54.81.92.6 1.44 1.51 1.44 2.63 0 2.6-2.5 4.56-5.54 4.56-2.83 0-5-1.78-5.16-4.5h3.01c.1 1.15 1.13 1.79 2.15 1.79 1.25 0 2.37-.4 2.37-1.32 0-.86-.74-1.26-2.37-1.26H9.5v-2.71h3.06z"/>
                </svg>
              </ToolbarButton>
            </ToolbarGroup>
            
            <div style={{ width: '1px', height: '20px', background: '#e1e5e9', margin: '0 8px' }} />
            
            {/* 제목 드롭다운 */}
            <DropdownContainer>
              <DropdownButton
                onClick={() => setHeadingDropdown(!headingDropdown)}
                title="Headings"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 4v3h5.5v12h3V7H19V4z"/>
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </DropdownButton>
              <DropdownMenu $isOpen={headingDropdown}>
                <DropdownItem
                  $isActive={editor.isActive('paragraph')}
                  onClick={() => {
                    editor.chain().focus().clearNodes().run();
                    setHeadingDropdown(false);
                  }}
                >
                  단락
                </DropdownItem>
                <DropdownItem
                  $isActive={editor.isActive('heading', { level: 1 })}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setHeadingDropdown(false);
                  }}
                >
                  제목 1
                </DropdownItem>
                <DropdownItem
                  $isActive={editor.isActive('heading', { level: 2 })}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setHeadingDropdown(false);
                  }}
                >
                  제목 2
                </DropdownItem>
                <DropdownItem
                  $isActive={editor.isActive('heading', { level: 3 })}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setHeadingDropdown(false);
                  }}
                >
                  제목 3
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
            
            {/* 색상 및 크기 */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={() => {
                  const color = window.prompt('글자 색상 (hex 코드):');
                  if (color) {
                    editor.chain().focus().setColor(color).run();
                  }
                }}
                title="Text Color"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.62 12L12 5.67 14.38 12H9.62zM11 3L5.5 17h2.25l1.12-3h6.25l1.12 3H18.5L13 3H11zM2 20h20v4H2v-4z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  const color = window.prompt('형광펜 색상 (hex 코드):');
                  if (color) {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                }}
                title="Highlight"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 14l3 3-3 3-3-3 3-3zm0-2L2 8l4-4 4 4-4 4zm5.5-.5L15 8l4 4-3.5 3.5-4-4zM12 2l3.5 3.5-4 4L8 6l4-4z"/>
                </svg>
              </ToolbarButton>
            </ToolbarGroup>
            
            <div style={{ width: '1px', height: '20px', background: '#e1e5e9', margin: '0 8px' }} />
            
            {/* 정렬 드롭다운 */}
            <DropdownContainer>
              <DropdownButton
                onClick={() => setAlignDropdown(!alignDropdown)}
                title="Text Align"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </DropdownButton>
              <DropdownMenu $isOpen={alignDropdown}>
                <DropdownItem
                  $isActive={editor.isActive({ textAlign: 'left' })}
                  onClick={() => {
                    editor.chain().focus().setTextAlign('left').run();
                    setAlignDropdown(false);
                  }}
                >
                  좌측 정렬
                </DropdownItem>
                <DropdownItem
                  $isActive={editor.isActive({ textAlign: 'center' })}
                  onClick={() => {
                    editor.chain().focus().setTextAlign('center').run();
                    setAlignDropdown(false);
                  }}
                >
                  가운데 정렬
                </DropdownItem>
                <DropdownItem
                  $isActive={editor.isActive({ textAlign: 'right' })}
                  onClick={() => {
                    editor.chain().focus().setTextAlign('right').run();
                    setAlignDropdown(false);
                  }}
                >
                  우측 정렬
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
            
            {/* 리스트 및 인용 */}
            <ToolbarGroup>
              <ToolbarButton
                $isActive={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                $isActive={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                $isActive={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Quote"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </ToolbarButton>
            </ToolbarGroup>
            
            <div style={{ width: '1px', height: '20px', background: '#e1e5e9', margin: '0 8px' }} />
            
            {/* 삽입 */}
            <ToolbarGroup>
              <ToolbarButton
                onClick={() => {
                  const url = window.prompt('링크 URL을 입력하세요:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                title="Link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  const url = window.prompt('이미지 URL을 입력하세요:');
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }}
                title="Image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                }}
                title="Table"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z"/>
                </svg>
              </ToolbarButton>
            </ToolbarGroup>
          </Toolbar>
          
          <EditorWrapper>
            <EditorContent editor={editor} />
          </EditorWrapper>
        </EditorContainer>

        <div style={{ display: 'flex', gap: '12px' }}>
          <SubmitButton
            type="submit"
            disabled={isLoading}
            $loading={isLoading}
          >
            {isLoading ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '공지사항 수정' : '공지사항 등록')}
          </SubmitButton>
          {isEditMode && onCancel && (
            <SubmitButton
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              $loading={false}
              style={{ backgroundColor: '#6c757d' }}
            >
              취소
            </SubmitButton>
          )}
        </div>
      </Form>
    </Container>
  );
};
