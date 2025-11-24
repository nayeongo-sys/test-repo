import { http, HttpResponse } from 'msw';
import { Notice, CreateNoticeRequest, UpdateNoticeRequest } from '../types/notice';

let mockNotices: Notice[] = [
  {
    id: 1,
    title: '시스템 점검 안내',
    content: '<p>2024년 1월 15일 오전 2시부터 4시까지 시스템 점검이 있습니다.</p>',
    author: '관리자',
    createdAt: '2024-01-10T09:00:00Z',
    isExposed: true
  },
  {
    id: 2,
    title: '새로운 기능 업데이트',
    content: '<p>사용자 프로필 기능이 추가되었습니다.</p>',
    author: '개발팀',
    createdAt: '2024-01-08T14:30:00Z',
    isExposed: false
  }
];

export const handlers = [
  http.get('/api/notices', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    let filteredNotices = [...mockNotices];
    
    // 타입 필터링
    const type = searchParams.get('type');
    if (type === 'EXPOSED') {
      filteredNotices = filteredNotices.filter(n => n.isExposed);
    } else if (type === 'HIDDEN') {
      filteredNotices = filteredNotices.filter(n => !n.isExposed);
    }
    
    // 텍스트 검색
    const text = searchParams.get('text');
    if (text) {
      filteredNotices = filteredNotices.filter(n => 
        n.title.includes(text) || n.content.includes(text)
      );
    }
    
    // 날짜 필터링
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredNotices = filteredNotices.filter(n => {
        const noticeDate = new Date(n.createdAt);
        return noticeDate >= start && noticeDate <= end;
      });
    }
    
    return HttpResponse.json(filteredNotices);
  }),

  http.get('/api/notices/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const notice = mockNotices.find(n => n.id === id);
    
    if (!notice) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(notice);
  }),

  http.post('/api/notices', async ({ request }) => {
    const body = await request.json() as CreateNoticeRequest;
    const newNotice: Notice = {
      id: mockNotices.length + 1,
      title: body.title,
      content: body.content,
      author: '작성자',
      createdAt: new Date().toISOString(),
      isExposed: body.isExposed === 'true'
    };
    
    mockNotices.unshift(newNotice);
    return HttpResponse.json(newNotice, { status: 201 });
  }),

  http.put('/api/notices/:id', async ({ params, request }) => {
    const id = parseInt(params.id as string);
    const body = await request.json() as UpdateNoticeRequest;
    const noticeIndex = mockNotices.findIndex(n => n.id === id);
    
    if (noticeIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockNotices[noticeIndex] = {
      ...mockNotices[noticeIndex],
      title: body.title,
      content: body.content,
      isExposed: body.isExposed === 'true'
    };
    
    return HttpResponse.json(mockNotices[noticeIndex]);
  })
];