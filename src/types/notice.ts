export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isExposed: boolean;
}

export interface CreateNoticeRequest {
  title: string;
  isExposed: string;
  content: string;
}

export interface UpdateNoticeRequest {
  title: string;
  isExposed: string;
  content: string;
}

export interface NoticeSearchRequest {
  dateSearchType: 'MODIFIED_DATE' | 'CREATED_DATE';
  startDate: string;
  endDate: string;
  createdId: string;
  type: 'ALL' | 'EXPOSED' | 'HIDDEN';
  text: string;
}