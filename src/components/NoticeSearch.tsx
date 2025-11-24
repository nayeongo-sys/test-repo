import { useState } from 'react';
import styled from 'styled-components';
import { NoticeSearchRequest } from '../types/notice';

const SearchContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #FA0050;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #d1003f;
  }
`;

interface NoticeSearchProps {
  onSearch: (params: Partial<NoticeSearchRequest>) => void;
  initialValues?: Partial<NoticeSearchRequest>;
}

export const NoticeSearch = ({ onSearch, initialValues }: NoticeSearchProps) => {
  const [searchParams, setSearchParams] = useState<Partial<NoticeSearchRequest>>({
    dateSearchType: 'MODIFIED_DATE',
    startDate: '',
    endDate: '',
    createdId: '',
    type: 'ALL',
    text: '',
    ...initialValues
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleChange = (field: keyof NoticeSearchRequest, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>검색 기준</Label>
          <Select 
            value={searchParams.dateSearchType} 
            onChange={(e) => handleChange('dateSearchType', e.target.value)}
          >
            <option value="MODIFIED_DATE">수정일</option>
            <option value="CREATED_DATE">작성일</option>
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>시작일</Label>
          <Input 
            type="date" 
            value={searchParams.startDate?.split('T')[0] || ''}
            onChange={(e) => handleChange('startDate', e.target.value ? `${e.target.value}T00:00:00.000Z` : '')}
          />
        </InputGroup>

        <InputGroup>
          <Label>종료일</Label>
          <Input 
            type="date" 
            value={searchParams.endDate?.split('T')[0] || ''}
            onChange={(e) => handleChange('endDate', e.target.value ? `${e.target.value}T23:59:59.999Z` : '')}
          />
        </InputGroup>

        <InputGroup>
          <Label>작성자 ID</Label>
          <Input 
            type="text" 
            value={searchParams.createdId}
            onChange={(e) => handleChange('createdId', e.target.value)}
            placeholder="작성자 ID"
          />
        </InputGroup>

        <InputGroup>
          <Label>공개 상태</Label>
          <Select 
            value={searchParams.type} 
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="EXPOSED">공개</option>
            <option value="HIDDEN">비공개</option>
          </Select>
        </InputGroup>

        <InputGroup>
          <Label>검색어</Label>
          <Input 
            type="text" 
            value={searchParams.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="제목 또는 내용"
          />
        </InputGroup>

        <SearchButton type="submit">검색</SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};