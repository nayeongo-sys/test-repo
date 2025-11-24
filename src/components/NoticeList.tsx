import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { noticeApi } from '../api/noticeApi';
import { NoticeSearch } from './NoticeSearch';
import { NoticeEditor } from './NoticeEditor';
import { NoticeSearchRequest } from '../types/notice';
import DOMPurify from 'dompurify';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 24px;
`;

const NoticeCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const NoticeTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
`;

const NoticeContent = styled.div`
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
`;

const NoticeInfo = styled.div`
  font-size: 14px;
  color: #999;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditButton = styled.button`
  padding: 4px 12px;
  background-color: #FA0050;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d1003f;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
`;

export const NoticeList = () => {
  const [searchParams, setSearchParams] = useState<Partial<NoticeSearchRequest>>({});
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  
  const { data: notices, isLoading, error } = useQuery({
    queryKey: ['notices', searchParams],
    queryFn: () => noticeApi.getNotices(searchParams)
  });

  const handleSearch = (params: Partial<NoticeSearchRequest>) => {
    setSearchParams(params);
  };
  
  const handleEdit = (noticeId: number) => {
    setEditingNoticeId(noticeId);
  };
  
  const handleCancelEdit = () => {
    setEditingNoticeId(null);
  };
  
  if (editingNoticeId) {
    return (
      <NoticeEditor 
        noticeId={editingNoticeId} 
        onCancel={handleCancelEdit}
      />
    );
  }

  if (isLoading) return <LoadingMessage>로딩 중...</LoadingMessage>;
  if (error) return <ErrorMessage>에러가 발생했습니다.</ErrorMessage>;

  return (
    <Container>
      <Title>공지사항</Title>
      <NoticeSearch onSearch={handleSearch} initialValues={searchParams} />
      {notices?.map(notice => (
        <NoticeCard key={notice.id}>
          <NoticeTitle>{notice.title}</NoticeTitle>
          <NoticeContent 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(notice.content) 
            }}
          />
          <NoticeInfo>
            <span>작성자: {notice.author} | {new Date(notice.createdAt).toLocaleDateString()}</span>
            <EditButton onClick={() => handleEdit(notice.id)}>
              수정
            </EditButton>
          </NoticeInfo>
        </NoticeCard>
      ))}
    </Container>
  );
};