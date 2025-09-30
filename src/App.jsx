import { useEffect, useMemo, useRef, useState } from "react";

const guideImg = "./img/fixed_face.png";
const naverImg = "./img/naver.png";
const kakaoImg = "./img/kakao.png";
const googleImg = "./img/google.png";

export default function App() {
  // 헤더 팝오버
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const signRef = useRef(null);
  const loginRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (signRef.current && !signRef.current.contains(e.target)) setOpenSignUp(false);
      if (loginRef.current && !loginRef.current.contains(e.target)) setOpenLogin(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // 폼 상태
  const [name, setName] = useState("이빛나");
  const [gender, setGender] = useState("여");
  const [feature, setFeature] = useState("");
  const options = useMemo(() => ["안경", "선글라스", "귀걸이", "반지", "시계", "블러쉬", "주근깨"], []);
  const [selected, setSelected] = useState([]);
  const toggle = (opt) =>
    setSelected((prev) => (prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]));

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_40%,#f7f7fb_100%)] text-slate-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-extrabold select-none tracking-tight">
            <span className="text-yellow-400">-</span>
            <span className="text-blue-600">SelfStar.AI</span>
            <span className="text-yellow-400">-</span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold ml-36">
            <a className="text-blue-700">홈</a>
            <a className="hover:text-slate-700">채팅</a>
            <a className="hover:text-slate-700">마이페이지</a>
            <a className="hover:text-slate-700">알림</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative" ref={signRef}>
              <button
                className={"btn-ghost " + (openSignUp ? "ring-2 ring-slate-300" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSignUp((v) => !v);
                  setOpenLogin(false);
                }}
              >
                무료로 회원가입
              </button>
              {openSignUp && (
                <Popover>
                  <p className="text-sm text-slate-500 mb-3">무료 회원가입</p>
                  <div className="flex flex-col gap-3">
                    <AuthItem label="네이버로 회원가입" img={naverImg} />
                    <AuthItem label="카카오로 회원가입" img={kakaoImg} />
                    <AuthItem label="Google로 회원가입" img={googleImg} />
                  </div>
                </Popover>
              )}
            </div>

            <div className="relative" ref={loginRef}>
              <button
                className={"btn-ghost " + (openLogin ? "ring-2 ring-slate-300" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenLogin((v) => !v);
                  setOpenSignUp(false);
                }}
              >
                로그인
              </button>
              {openLogin && (
                <Popover>
                  <p className="text-sm text-slate-500 mb-3">간편 로그인</p>
                  <div className="flex flex-col gap-3">
                    <AuthItem label="네이버로 로그인" img={naverImg} />
                    <AuthItem label="카카오로 로그인" img={kakaoImg} />
                    <AuthItem label="Google로 로그인" img={googleImg} />
                  </div>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 폼 */}
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* 좌: 검은 프리뷰 */}
          <section className="card overflow-hidden">
            <div className="bg-black flex items-center justify-center">
              <div className="relative w-[520px] h-[520px]">
                <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
              </div>
            </div>
            <div className="p-5 bg-blue-50">
              <h3 className="text-2xl font-semibold mb-1 tracking-tight">
                나만의 인플루언서를 만들어보세요.
              </h3>
              <p className="text-sm text-slate-600">
                얼굴 ID를 고정하여 다양한 이미지를 구축할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 우: 입력 폼 */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-[0_20px_40px_rgba(30,64,175,0.08)] relative w-[520px] h-[618px]">
            <div className="flex items-start gap-3 mb-5">
              <img src={guideImg} alt="guide" className="w-11 h-11 rounded-full object-cover border" />
              <div className="text-sm px-4 rounded-lg border border-blue-300 bg-white/70">
                저는 <b>SelfStar.AI</b> 가이드 <b>이빛나</b>라고 합니다. <br />
                인플루언서의 <b>이름</b>과 <b>옵션</b> 및 <b>특징</b>을 <b>입력</b>해주세요.
              </div>
            </div>

            <Field label="이름">
              <input
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이빛나"
              />
            </Field>

            <Field label="성별">
              <div className="relative">
                <select
                  className="w-full appearance-none px-4 py-2 rounded-lg border border-blue-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>여</option>
                  <option>남</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ▾
                </span>
              </div>
            </Field>

            <div className="mb-2 text-sm font-semibold">
              특징 <span className="text-slate-400">· 인플루언서의 특징을 작성해주세요.</span>
            </div>
            <Field>
              <input
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white/70 placeholder:text-blue-500/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="ex) 귀여운 이미지"
              />
            </Field>

            <div className="mb-2 text-sm font-semibold">
              옵션 <span className="text-slate-400">· 중복 선택 가능</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {options.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={"chip " + (active ? "border-blue-400 bg-white text-blue-700 shadow-sm" : "")}
                    aria-pressed={active}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end mt-20 mr-1">
              <button className="btn-primary" onClick={() => alert("인플루언서 생성 준비중입니다.")}>
                인플루언서 생성
              </button>
            </div>
          </section>
        </div>

        {/* 스크롤 유도 */}
        <div className="flex flex-col items-center mt-10 text-slate-400">
          <div className="scroll-mouse"></div>
          <p className="text-xs mt-2">스크롤을 내려주세요.</p>
        </div>
      </main>

      {/* 랜딩 섹션 */}
      <LandingSections />
    </div>
  );
}

/* 팝오버 */
function Popover({ children }) {
  return (
    <div
      className="absolute top-full right-0 mt-3 w-[380px] rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.12)] p-5 z-50"
      onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
    >
      {children}
    </div>
  );
}

/* 필드 */
function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      {label && <label className="block mb-2 text-sm font-semibold">{label}</label>}
      {children}
      {hint && <p className="mt-2 text-xs text-blue-500/80">{hint}</p>}
    </div>
  );
}

/* 간편 항목: 이미지 아이콘 or 컬러 점 */
function AuthItem({ label, img, dot }) {
  return (
    <button
      className="w-full flex items-center justify-start gap-3 px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition"
      onClick={() => alert(`${label} (OAuth 연동 예정)`)}
      type="button"
    >
      {img ? (
        <img src={img} alt="" className="w-5 h-5 object-contain" />
      ) : (
        <span className={`w-3 h-3 rounded-full ${dot}`} />
      )}
      <span>{label}</span>
    </button>
  );
}

/* ==== 스크롤 리빌 유틸 ==== */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.unobserve(el);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, show];
}

function Reveal({ children, from = "up", delay = 0 }) {
  const [ref, show] = useInView(0.15);
  const start =
    "reveal-anim reveal-hide " +
    (from === "left" ? "from-left" : from === "right" ? "from-right" : from === "down" ? "from-down" : "from-up");
  return (
    <div
      ref={ref}
      className={show ? "reveal-anim reveal-show to-center" : start}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ==== 랜딩 섹션 ==== */
function LandingSections() {
  const hero = "./img/hero.png";
  const step1 = "./img/step1.png";
  const step2 = "./img/step2.png";
  const step3 = "./img/step3.png";

  return (
    <section className="bg-[#ecf5ff]/50 border-t">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-20">

        {/* SelfStar 타이틀 */}
        <Reveal from="up">
          <div className="pt-6">
            <div className="flex items-center justify-center gap-6 mb-2">
              <span className="hidden md:block h-1 w-16 bg-yellow-300 rounded-full" />
              <h1
                className="
                  font-extrabold tracking-tight text-blue-600
                  text-[clamp(48px,10vw,140px)]
                  leading-none text-center
                "
              >
                SelfStar.AI
              </h1>
              <span className="hidden md:block h-1 w-16 bg-yellow-300 rounded-full" />
            </div>

            <p className="text-center mt-4 text-lg md:text-2xl font-semibold text-slate-900">
              자신만의 인플루언서를 생성하여 <span className="underline decoration-blue-400">활동해보세요!</span>
            </p>
          </div>
        </Reveal>

        {/* 01 섹션 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal from="left">
            <img src={hero} alt="hero" className="w-full rounded-2xl shadow border object-cover" />
          </Reveal>

          <div className="space-y-4">
            <Reveal from="right" delay={120}>
              <div className="card p-6 mb-2">
                <div className="text-3xl font-black text-blue-500 mb-3">01</div>
                <p className="text-slate-700 leading-relaxed">
                  캠퍼스 무드 그대로, <br/>
                  나만의 AI 인플루언서를 지금 우리 서비스에서 시작해보세요!
                </p>
              </div>
            </Reveal>

            <Reveal from="up" delay={200}>
              <div className="flex items-center justify-center gap-3 mr-12">
                <span className="text-2xl md:text-3xl text-blue-600">»» Step 1</span>
                <span className="text-slate-500">인플루언서 이름과 특징 · 옵션을 선택해주세요.</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 02 섹션 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Reveal from="left">
              <div className="card p-6">
                <div className="text-3xl font-black text-blue-500 mb-3">02</div>
                <p className="text-slate-700">요청한 이미지를 기반으로 멋진 결과물을 제작해드립니다.</p>
              </div>
            </Reveal>

            <Reveal from="up" delay={100}>
              <div className="flex items-center justify-center gap-3 mr-24">
                <span className="text-2xl md:text-3xl text-blue-600">»» Step 2</span>
                <span className="text-slate-500 mr-3 mt-1">방법은 간단하게, 결과물은 퀄리티 높게</span>
              </div>
            </Reveal>
          </div>

          <Reveal from="right" delay={120}>
            <img src={step2 || step1} alt="step2" className="w-full rounded-2xl shadow border" />
          </Reveal>
        </div>

        {/* 03 섹션 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal from="left">
            <img src={step3 || step1} alt="step3" className="w-full rounded-2xl shadow border" />
          </Reveal>

          <div className="space-y-4">
            <Reveal from="right" delay={120}>
              <div className="card p-6">
                <div className="text-3xl font-black text-blue-500 mb-3">03</div>
                <p className="text-slate-700">계정 연동 시 Instagram &amp; Thread 자동 업로드 및 댓글까지!</p>
              </div>
            </Reveal>

            <Reveal from="up" delay={200}>
              <div className="flex items-center justify-center gap-3 mr-24">
                <span className="text-2xl md:text-3xl text-blue-600">»» Step 3</span>
                <span className="text-slate-500">연동 설정 후 자동 운영을 시작해보세요.</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 04~06 카드 */}
        <div className="grid md:grid-cols-3 gap-6">
          <Reveal from="up">
            <div className="card h-48 md:h-56 p-4">
              <b className="text-blue-500">04</b>
              <div className="text-slate-500 mt-2">업데이트 예정</div>
            </div>
          </Reveal>
          <Reveal from="up" delay={80}>
            <div className="card h-48 md:h-56 p-4 mt-10">
              <b className="text-blue-500">05</b>
              <div className="text-slate-500 mt-2">업데이트 예정</div>
            </div>
          </Reveal>
          <Reveal from="up" delay={160}>
            <div className="card h-48 md:h-56 p-4 mt-20">
              <b className="text-blue-500">06</b>
              <div className="text-slate-500 mt-2">업데이트 예정</div>
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="bg-blue-400">
        <div>
          <span className="text-yellow-400">-</span>
          <span className="text-blue-600 text-sm font-semibold">SelfStar.AI</span>
          <span className="text-yellow-400">-</span>
        </div>
        <div>
          푸터내용
          
        </div>
      </footer>
    </section>
  );
}
