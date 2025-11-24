import axios from 'axios';
import { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeSearchRequest } from '../types/notice';

const api = axios.create({
  baseURL: '/api'
});

export const noticeApi = {
  getNotices: (params?: Partial<NoticeSearchRequest>): Promise<Notice[]> => 
    api.get('/notices', { params }).then(res => res.data),
  
  getNotice: (id: number): Promise<Notice> => 
    api.get(`/notices/${id}`).then(res => res.data),
    
  createNotice: (data: CreateNoticeRequest): Promise<Notice> =>
    api.post('/notices', data).then(res => res.data),
    
  updateNotice: (id: number, data: UpdateNoticeRequest): Promise<Notice> =>
    api.put(`/notices/${id}`, data).then(res => res.data)
};