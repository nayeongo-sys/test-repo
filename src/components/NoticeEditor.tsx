import { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

const EditorWrapper = styled.div`
  .ck-editor__editable {
    min-height: 200px;
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

interface NoticeEditorProps {
  noticeId?: number;
  onCancel?: () => void;
}

export const NoticeEditor = ({ noticeId, onCancel }: NoticeEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExposed, setIsExposed] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const editorRef = useRef<any>(null);
  
  const queryClient = useQueryClient();
  const isEditMode = !!noticeId;
  
  const { data: notice } = useQuery({
    queryKey: ['notice', noticeId],
    queryFn: () => noticeApi.getNotice(noticeId!),
    enabled: isEditMode
  });
  
  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setIsExposed(notice.isExposed);
    }
  }, [notice]);
  
  const createMutation = useMutation({
    mutationFn: (data: CreateNoticeRequest) => noticeApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setTitle('');
      setContent('');
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

  return (
    <Container>
      <Title>{isEditMode ? '공지사항 수정 (CKEditor)' : '공지사항 작성 (CKEditor)'}</Title>
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

        <EditorWrapper>
          <CKEditor
            editor={ClassicEditor as any}  // !!!!!!!! any ~?!?!?!?!?!?!?!?!!
            data={content}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
            onChange={() => {
              if (editorRef.current) {
                setContent(editorRef.current.getData());
              }
            }}
          />
        </EditorWrapper>

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
}