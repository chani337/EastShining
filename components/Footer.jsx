// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* 상단: 브랜드 + 링크 묶음 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 브랜드 */}
          <div className="space-y-3">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">SelfStar</span>.AI
            </div>
            <p className="text-sm text-slate-600 leading-6">
              SelfStar에서 가상의 인물을<br/>
              제작하여 인플루언서로 활동해보세요.<br/>
              저희가 도와드릴게요.
            </p>
            {/* 소셜 아이콘 */}
            <div className="flex items-center gap-4 pt-2">
              <a aria-label="Instagram" href="#" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a aria-label="Threads" href="#" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M7 12c0-3 2-5 5-5s5 2 5 6-3 7-7 7-6-2-6-6 2-6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </a>
              <a aria-label="YouTube" href="#" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="7" width="18" height="10" rx="3" stroke="currentColor"/>
                  <path d="M11 10l4 2-4 2v-4z" fill="currentColor"/>
                </svg>
              </a>
              <a aria-label="GitHub" href="#" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.5-1.5-1.9-1.5-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 .  1.4 2 .  1.4 1.2 2 3.1 1.4 3.8 1.1.1-.9.5-1.4.9-1.8-2.6-.3-5.4-1.3-5.4-6a4.7 4.7 0 0 1 1.2-3.3 4.4 4.4 0 0 1 .1-3.3s1-.3 3.4 1.3a11.8 11.8 0 0 1 6.2 0C17.5 5 18.5 5.3 18.5 5.3a4.4 4.4 0 0 1 .1 3.3 4.7 4.7 0 0 1 1.2 3.3c0 4.7-2.8 5.7-5.4 6 .5.4 1 1.2 1 2.5v3.7c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"/>
                </svg>
              </a>
              <a aria-label="Email" href="mailto:hello@selfstar.ai" className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor"/>
                  <path d="M4 7l8 6 8-6" stroke="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">제품</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">대시보드</a></li>
              <li><a href="#" className="hover:text-slate-900">예약 발행</a></li>
              <li><a href="#" className="hover:text-slate-900">리포트/통계</a></li>
              <li><a href="#" className="hover:text-slate-900">크레딧/요금제</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">리소스</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">가이드</a></li>
              <li><a href="#" className="hover:text-slate-900">튜토리얼</a></li>
              <li><a href="#" className="hover:text-slate-900">공지사항</a></li>
            </ul>
          </div>

          <div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">소개</a></li>
              <li><a href="#" className="hover:text-slate-900">채용</a></li>
              <li><a href="#" className="hover:text-slate-900">문의</a></li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-8 border-t border-slate-200" />
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 언어 선택 (더미) */}
          <div className="flex items-center gap-3">
            <label htmlFor="lang" className="text-sm text-slate-600">언어</label>
            <select id="lang" className="h-9 px-3 rounded-xl border border-slate-300 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>한국어</option>
              <option>English</option>
            </select>
          </div>

          {/* 정책 링크 */}
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-slate-600 hover:text-slate-900">이용약관</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="text-slate-600 hover:text-slate-900">개인정보처리방침</a>
            <span className="text-slate-300">|</span>
            <a href="mailto:hello@selfstar.ai" className="text-slate-600 hover:text-slate-900">고객센터</a>
          </div>

          {/* 카피라이트 */}
          <div className="text-sm text-slate-500">
            © {year} SelfStar.AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
