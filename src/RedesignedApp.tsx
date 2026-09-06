import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  ExternalLink,
  Github,
  Mail,
  Menu,
  Mic2,
  Moon,
  Play,
  Search,
  Send,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-react';
import {
  ARTICLES,
  CATEGORIES,
  PODCASTS,
  PROJECTS,
  type Article,
  type Page,
  type Project,
} from './App';

type ThemeMode = 'auto' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

const BEIJING_TIME_ZONE = 'Asia/Shanghai';
const PORTRAIT_SRC = '/files/055bb64ff9f971595a2e8fb379274da0.jpg';
const GITHUB_URL = 'https://github.com/haotianmiao0829/-';

const getBeijingHour = () => {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: BEIJING_TIME_ZONE,
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
  );
  return hour === 24 ? 0 : hour;
};

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode !== 'auto') return mode;
  const hour = getBeijingHour();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
};

function useBeijingTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto';
    const saved = window.localStorage.getItem('haotianmiao-theme');
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(mode));

  useEffect(() => {
    const applyTheme = () => {
      const nextTheme = resolveTheme(mode);
      setResolvedTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      const themeColor = document.querySelector('meta[name="theme-color"]');
      themeColor?.setAttribute('content', nextTheme === 'light' ? '#edf4f8' : '#101a21');
    };

    applyTheme();
    const timer = window.setInterval(applyTheme, 60_000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') applyTheme();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', applyTheme);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', applyTheme);
    };
  }, [mode]);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      window.localStorage.setItem('haotianmiao-theme', nextMode);
    } catch {
      // The selected mode still applies for this session when storage is unavailable.
    }
  };

  return { mode, setMode, resolvedTheme };
}

function useScrollDirection() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const nextY = window.scrollY;
        const delta = nextY - lastY;
        if (nextY < 72 || delta < -4) setIsHidden(false);
        if (nextY > 120 && delta > 4) setIsHidden(true);
        lastY = nextY;
        frame = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return isHidden;
}

function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const supportsFinePointer = window.innerWidth > 760 && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.documentElement.classList.remove('has-custom-cursor');
    if (!supportsFinePointer || prefersReducedMotion || !cursorRef.current) return;

    const cursor = cursorRef.current;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const handleOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [data-cursor="interactive"]');
      cursor.dataset.active = interactive ? 'true' : 'false';
    };

    document.documentElement.classList.add('has-custom-cursor');
    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerover', handleOver, true);
    frame = window.requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerover', handleOver, true);
      window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return <div ref={cursorRef} className="cursor-follower" aria-hidden="true" />;
}

function HeroAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !hero || !context) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let startedAt = performance.now();
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const drawBundle = ({
      start,
      end,
      wave,
      frequency,
      pinch,
      spread,
      count,
      phase,
      color,
      alpha,
      time,
    }: {
      start: number;
      end: number;
      wave: number;
      frequency: number;
      pinch: number;
      spread: number;
      count: number;
      phase: number;
      color: [number, number, number];
      alpha: number;
      time: number;
    }) => {
      for (let line = 0; line < count; line += 1) {
        const offset = line - (count - 1) / 2;
        context.beginPath();

        for (let sample = 0; sample <= 96; sample += 1) {
          const progress = sample / 96;
          const x = (progress * 1.22 - 0.11) * width;
          const center = height * (start + (end - start) * progress);
          const waveOffset = Math.sin(progress * frequency + phase + time * 0.34) * height * wave;
          const pinchFactor = 0.16 + 0.84 * Math.min(1, Math.abs(progress - pinch) * 1.85);
          const pointerLift = (pointerY - 0.5) * (progress - 0.5) * height * 0.035;
          const y = center + waveOffset + offset * (spread * height / count) * pinchFactor + pointerLift;

          if (sample === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const lineAlpha = alpha * (0.78 + (line % 5) * 0.055);
        context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${lineAlpha})`;
        context.lineWidth = line % 7 === 0 ? 1.15 : 0.8;
        context.stroke();
      }
    };

    const drawContour = (isTop: boolean, color: [number, number, number], time: number) => {
      context.beginPath();
      for (let sample = 0; sample <= 100; sample += 1) {
        const progress = sample / 100;
        const x = (progress * 1.12 - 0.06) * width;
        const edgeWave = Math.sin(progress * 7.2 + time * 0.24) * height * 0.035;
        const secondaryWave = Math.sin(progress * 16 - time * 0.13) * height * 0.012;
        const base = isTop ? height * 0.12 : height * 0.88;
        const y = base + (isTop ? edgeWave + secondaryWave : -edgeWave - secondaryWave)
          + (pointerX - 0.5) * width * 0.018;
        if (sample === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.62)`;
      context.lineWidth = 2.1;
      context.stroke();
    };

    const draw = (now: number) => {
      if (!width || !height) resize();

      const elapsed = (now - startedAt) / 1000;
      const motionScale = prefersReducedMotion ? 0 : 1;
      const time = elapsed * motionScale;
      pointerX += (targetPointerX - pointerX) * 0.04;
      pointerY += (targetPointerY - pointerY) * 0.04;
      context.clearRect(0, 0, width, height);

      const isDark = document.documentElement.dataset.theme === 'dark';
      const lineColor: [number, number, number] = isDark ? [184, 211, 221] : [115, 137, 149];
      const softColor: [number, number, number] = isDark ? [111, 164, 183] : [157, 177, 187];
      const contourTopColor: [number, number, number] = isDark ? [143, 198, 223] : [92, 157, 186];
      const contourBottomColor: [number, number, number] = isDark ? [196, 169, 214] : [156, 143, 182];

      drawBundle({
        start: 0.05,
        end: 0.78,
        wave: 0.105,
        frequency: 4.3,
        pinch: 0.35,
        spread: 0.46,
        count: 24,
        phase: 0.4,
        color: lineColor,
        alpha: isDark ? 0.13 : 0.17,
        time,
      });
      drawBundle({
        start: 0.84,
        end: 0.26,
        wave: 0.09,
        frequency: 4.9,
        pinch: 0.62,
        spread: 0.34,
        count: 19,
        phase: 2.2,
        color: softColor,
        alpha: isDark ? 0.12 : 0.15,
        time: time * 0.82,
      });
      drawBundle({
        start: 0.46,
        end: 0.58,
        wave: 0.055,
        frequency: 6.2,
        pinch: 0.47,
        spread: 0.2,
        count: 13,
        phase: 4.1,
        color: lineColor,
        alpha: isDark ? 0.08 : 0.1,
        time: time * 0.65,
      });

      drawContour(true, contourTopColor, time);
      drawContour(false, contourBottomColor, time * 0.86);
    };

    const render = (now: number) => {
      draw(now);
      if (!prefersReducedMotion && document.visibilityState === 'visible') {
        frame = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      targetPointerX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      targetPointerY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    };

    const handlePointerLeave = () => {
      targetPointerX = 0.5;
      targetPointerY = 0.5;
    };

    const handleVisibility = () => {
      window.cancelAnimationFrame(frame);
      if (document.visibilityState === 'visible') {
        startedAt = performance.now() - (prefersReducedMotion ? 0 : 1);
        render(performance.now());
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    hero.addEventListener('pointermove', handlePointerMove, { passive: true });
    hero.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    resize();
    render(performance.now());

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', handlePointerMove);
      hero.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="hero-atmosphere" aria-hidden="true" />;
}

function SplashScreen({ onSkip }: { onSkip: () => void }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') onSkip();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  const transition = { duration: prefersReducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      className="splash-screen"
      role="dialog"
      aria-label="浩天淼作品集启动页"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <div className="splash-content">
        <motion.span
          className="splash-kicker"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
        >
          浩天淼 / PORTFOLIO
        </motion.span>
        <motion.p
          className="splash-statement"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.14 }}
        >
          <span>一定要做有思考的设计，</span>
          <span>一定要做有温度的产品，</span>
          <span>持续迭代，持续成长，持续向前，</span>
          <span>坚持不懈，改逻辑，塑人生，忘忧愁，得永生。</span>
        </motion.p>
        <motion.button
          type="button"
          className="splash-skip"
          onClick={onSkip}
          data-cursor="interactive"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.3 }}
        >
          跳过 <ArrowRight size={15} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: string | number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function ThemeControl({ mode, setMode }: { mode: ThemeMode; setMode: (mode: ThemeMode) => void }) {
  const options: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: 'auto', label: '自动', icon: Clock3 },
    { value: 'light', label: '明亮', icon: Sun },
    { value: 'dark', label: '暗色', icon: Moon },
  ];

  return (
    <div className="theme-control" aria-label="主题模式">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={mode === value ? 'is-selected' : ''}
          onClick={() => setMode(value)}
          aria-label={label}
          aria-pressed={mode === value}
          title={label}
        >
          <Icon size={14} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function Tag({ children }: { children: ReactNode; key?: string | number }) {
  return <span className="tag">{children}</span>;
}

function CategoryCard({
  category,
  index,
  onClick,
}: {
  category: (typeof CATEGORIES)[number];
  index: number;
  onClick: () => void;
}) {
  const count = PROJECTS.filter((project) => project.category === category.name).length;
  return (
    <motion.button
      type="button"
      className={`category-card category-tone-${index + 1}`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      data-cursor="interactive"
    >
      <span className="category-index">0{index + 1}</span>
      <span className="category-year">{category.year}</span>
      <span className="category-art" aria-hidden="true">
        <span />
      </span>
      <span className="category-name">{category.name}</span>
      <span className="category-description">{category.description}</span>
      <span className="category-foot">
        <span>{count} 个作品</span>
        <ArrowUpRight size={18} strokeWidth={1.5} />
      </span>
    </motion.button>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const isExternal = project.link !== '#';
  const content = (
    <>
      <div className={`project-art project-art-${project.id}`}>
        <span className="project-art-label">{project.category}</span>
        <span className="project-art-title">{project.title}</span>
        <ArrowUpRight className="project-art-arrow" size={22} strokeWidth={1.5} />
      </div>
      <div className="project-card-body">
        <div>
          <div className="project-meta">
            <span>{project.year}</span>
            <span>{project.tags.slice(0, 2).join(' / ')}</span>
          </div>
          <h3>{project.title}</h3>
          {project.description && <p>{project.description}</p>}
        </div>
        <span className="project-open">{isExternal ? '打开作品' : '查看详情'} <ArrowRight size={16} /></span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a className="project-card" href={project.link} target="_blank" rel="noreferrer" data-cursor="interactive">
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="project-card" onClick={onOpen} data-cursor="interactive">
      {content}
    </button>
  );
}

function HomeView({
  onNavigate,
  onOpenProjects,
}: {
  onNavigate: (page: Page) => void;
  onOpenProjects: (category?: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home-view">
      <section className="hero-section" aria-labelledby="hero-title">
        <HeroAtmosphere />
        <div className="hero-intro">
          <Reveal>
            <div className="hero-kicker">探索</div>
            <p className="hero-name">浩天淼</p>
          </Reveal>
        </div>

        <div className="hero-manifesto-anchor">
          <Reveal className="hero-manifesto">
            <h1 id="hero-title">
              <span>一定要做有思考的设计，一定要做有温度的产品，持续迭代，持续成长，持续向前，坚持不懈</span>
              <span>改逻辑，塑人生，忘忧愁，得永生</span>
            </h1>
          </Reveal>
        </div>

        <div className="hero-footerline">
          <span>重庆 · 北京 · 远方</span>
          <button type="button" onClick={() => scrollTo('selected-work')} data-cursor="interactive">
            向下探索 <ChevronDown size={16} />
          </button>
          <span>2026 / PORTFOLIO</span>
        </div>
      </section>

      <section className="statement-band" aria-label="个人信念">
        <Reveal className="statement-band-inner">
          <span className="statement-number">01</span>
          <p>把复杂的事情讲清楚，把重要的体验做温柔。</p>
          <span className="statement-rule" />
          <span className="statement-note">持续前进 / KEEP MOVING</span>
        </Reveal>
      </section>

      <section id="selected-work" className="section-block">
        <Reveal>
          <SectionHeading eyebrow="SELECTED WORK" title="精选作品" description="从产品体验到影像记录，保留正在生长的部分。" />
        </Reveal>
        <div className="category-grid">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.06}>
              <CategoryCard category={category} index={index} onClick={() => onOpenProjects(category.name)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-lower-grid section-block">
        <Reveal className="home-panel-reveal">
          <motion.button
            type="button"
            className="home-feature-panel home-action-panel"
            onClick={() => onNavigate('about')}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            data-cursor="interactive"
            aria-label="阅读我的经历"
          >
            <div className="panel-label">A NOTE TO MYSELF</div>
            <h2>先把每一次尝试做好，答案会在路上出现。</h2>
            <p>这里记录作品，也记录一个人如何在设计、产品、影像和生活之间不断换气。</p>
            <span className="text-link">阅读我的经历 <ArrowUpRight size={16} /></span>
          </motion.button>
        </Reveal>
        <Reveal className="home-panel-reveal" delay={0.08}>
          <motion.button
            type="button"
            className="home-article-panel home-action-panel"
            onClick={() => onNavigate('articles')}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            whileTap={prefersReducedMotion ? undefined : { y: 1, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            data-cursor="interactive"
            aria-label="进入最近文章"
          >
            <div className="panel-label">LATEST ARTICLE / 最近文章</div>
            <h3>{ARTICLES[0]?.title}</h3>
            <p>{ARTICLES[0]?.excerpt}</p>
            <span className="text-link">进入文章 <ArrowRight size={16} /></span>
          </motion.button>
        </Reveal>
      </section>

      <section className="closing-band">
        <Reveal>
          <p>愿你平安、喜乐、律己、成长。</p>
          <span>浩天淼 / HAO TIAN MIAO</span>
        </Reveal>
      </section>
    </div>
  );
}

function ProjectsView({
  activeCategory,
  onCategoryChange,
  onProjectOpen,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onProjectOpen: (project: Project) => void;
}) {
  const selectedCategory = CATEGORIES.find((category) => category.name === activeCategory) ?? CATEGORIES[0];
  const categoryProjects = PROJECTS.filter((project) => project.category === selectedCategory.name);

  return (
    <div className="page-view projects-view">
      <Reveal>
        <SectionHeading eyebrow="ARCHIVE / 作品档案" title="作品集" description="选择一个方向，慢慢看正在形成的作品。" />
      </Reveal>
      <div className="category-tabs" role="tablist" aria-label="作品分类">
        {CATEGORIES.map((category) => (
          <button
            type="button"
            key={category.id}
            role="tab"
            aria-selected={activeCategory === category.name}
            className={activeCategory === category.name ? 'is-active' : ''}
            onClick={() => onCategoryChange(category.name)}
            data-cursor="interactive"
          >
            {activeCategory === category.name && <motion.span layoutId="category-indicator" className="tab-indicator" />}
            <span>{category.name}</span>
            <small>{String(PROJECTS.filter((project) => project.category === category.name).length).padStart(2, '0')}</small>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selectedCategory.name}
          className="project-grid"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {categoryProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.06}>
              <ProjectCard project={project} onOpen={() => onProjectOpen(project)} />
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const INTERNSHIPS = [
  {
    company: '北京饼干科技有限公司（像素绽放 PixelBloom）',
    role: '产品运营',
    period: '2025.06 — 2025.09',
    description: '负责核心 AIGC 产品（AI PPT / 写作）的运营与迭代，建立从用户反馈到需求定义的完整流程。',
  },
  {
    company: '辉塔信息技术咨询（北京）有限公司',
    role: '产品体验设计',
    period: '2025.09 — 2025.11',
    description: '参与中国工商银行、极氪汽车等 B 端项目落地，通过重构产品逻辑提升用户易用性与操作效率。',
  },
  {
    company: '重庆库田科技有限公司',
    role: 'AI 数据运营',
    period: '2025.11 — 2025.12',
    description: '参与 AI 图形训练项目，建立数据处理流程与监控机制，持续提升模型识别准确率。',
  },
];

const SKILL_GROUPS = [
  { title: 'AI / 智能工具', items: ['ChatGPT', 'Claude', 'Gemini', '千问', 'Kimi', '豆包', 'Coze'] },
  { title: '设计 / 影像', items: ['Figma', 'Axure', '墨刀', 'Premiere', 'After Effects', 'Blender', 'Stable Diffusion'] },
  { title: '协作 / 办公', items: ['飞书', 'Excel', 'Word', 'WPS'] },
];

function AboutView() {
  const [copied, setCopied] = useState(false);

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText('Z18132013791');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="page-view about-view">
      <section className="about-hero-screen" aria-label="关于我">
        <Reveal>
          <SectionHeading eyebrow="ABOUT / 关于我" title="慢慢成为自己" description="产品、内容、影像，都是我理解世界和表达自己的方式。" />
        </Reveal>

        <Reveal className="about-intro">
          <p>我想做有思考的设计，也想做有温度的产品。比起给自己贴一个固定的标签，我更愿意保持好奇，在不同的工作和生活里持续试错、持续成长。</p>
          <span>浩天淼 / CREATIVE PRACTITIONER</span>
        </Reveal>
      </section>

      <section className="about-profile-section" aria-label="个人信息">
        <Reveal className="profile-panel">
          <div className="profile-copy">
            <div className="panel-label">PROFILE / 个人信息</div>
            <h3>你好，我是浩天淼。</h3>
            <p>数字媒体艺术专业在读，正在寻找产品、内容、设计和 AI 之间更自然的连接。</p>
            <div className="profile-details">
              <span>常驻 / 重庆 · 北京</span>
              <span>邮箱 / 2587944602@qq.com</span>
              <span>微信 / Z18132013791</span>
            </div>
            <button type="button" className="button button-quiet" onClick={copyWechat} data-cursor="interactive">
              {copied ? <Check size={16} /> : <Mail size={16} />} {copied ? '微信号已复制' : '复制微信号'}
            </button>
          </div>
          <div className="profile-image-wrap">
            <img src={PORTRAIT_SRC} alt="浩天淼头像" className="profile-image" />
          </div>
        </Reveal>
      </section>

      <section className="about-section">
        <Reveal><SectionHeading eyebrow="EXPERIENCE / 经历" title="走过的路" /></Reveal>
        <div className="timeline-list">
          {INTERNSHIPS.map((item, index) => (
            <Reveal key={item.company} delay={index * 0.06} className="timeline-item">
              <span className="timeline-year">{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-company">{item.company}</p>
                <p>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-section">
        <Reveal><SectionHeading eyebrow="TOOLKIT / 工具箱" title="用什么工作" /></Reveal>
        <div className="skills-grid">
          {SKILL_GROUPS.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.06} className="skill-group">
              <h3>{group.title}</h3>
              <div className="skill-list">{group.items.map((item) => <Tag key={item}>{item}</Tag>)}</div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectDetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const isEmotionGarden = project.title === '情绪花园';

  return (
    <div className="page-view detail-view">
      <button type="button" className="back-link" onClick={onBack} data-cursor="interactive"><ArrowLeft size={16} /> 返回作品集</button>
      <Reveal>
        <div className="detail-heading">
          <span className="eyebrow">{project.category} / {project.year}</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="tag-list">{project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
        </div>
      </Reveal>
      <Reveal className="detail-media" delay={0.08}>
        {isEmotionGarden ? (
          <button type="button" className="pdf-preview" onClick={() => setPdfOpen(true)} data-cursor="interactive">
            <iframe src="/files/情绪花园.pdf#toolbar=0&navpanes=0&scrollbar=0" title="情绪花园项目预览" />
            <span>点击放大查看 PDF <ArrowUpRight size={16} /></span>
          </button>
        ) : (
          <div className={`project-art project-art-large project-art-${project.id}`}>
            <span className="project-art-label">{project.category}</span>
            <span className="project-art-title">项目内容正在整理</span>
          </div>
        )}
      </Reveal>
      <Reveal className="detail-copy" delay={0.14}>
        <div>
          <div className="panel-label">PROJECT NOTE</div>
          <h2>让想法变成可被使用的东西。</h2>
        </div>
        <p>{project.description} 这是一个持续迭代中的记录，后续会补充更多过程、判断和结果。</p>
      </Reveal>
      {pdfOpen && isEmotionGarden && (
        <div className="pdf-modal" role="dialog" aria-modal="true" aria-label="情绪花园 PDF" onClick={() => setPdfOpen(false)}>
          <button type="button" className="modal-close" onClick={() => setPdfOpen(false)} aria-label="关闭 PDF" data-cursor="interactive"><X size={24} /></button>
          <iframe src="/files/情绪花园.pdf#toolbar=0&navpanes=0&scrollbar=0" title="情绪花园 PDF" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function ArticlesView({ onArticleOpen }: { onArticleOpen: (article: Article) => void }) {
  return (
    <div className="page-view articles-view">
      <Reveal><SectionHeading eyebrow="WRITING / 文字记录" title="文章" description="把走过的路写下来，也给未来的自己留一个入口。" /></Reveal>
      <div className="article-list">
        {ARTICLES.map((article, index) => (
          <Reveal key={article.id} delay={index * 0.06}>
            <button type="button" className="article-card" onClick={() => onArticleOpen(article)} data-cursor="interactive">
              <div className="article-card-top"><span>{article.category}</span><span>{article.date} · {article.readTime}</span></div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <span className="text-link">阅读全文 <ArrowUpRight size={16} /></span>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ArticleDetailView({ article, onBack }: { article: Article; onBack: () => void }) {
  const [comments, setComments] = useState<Array<{ id: string; author: string; content: string; date: string }>>([]);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const paragraphs = article.content?.split(/\n+/).map((item) => item.trim()).filter(Boolean) ?? [];

  const addComment = () => {
    if (!author.trim() || !comment.trim()) return;
    setComments((current) => [
      { id: String(Date.now()), author: author.trim(), content: comment.trim(), date: new Date().toLocaleDateString('zh-CN') },
      ...current,
    ]);
    setAuthor('');
    setComment('');
  };

  return (
    <div className="page-view article-detail-view">
      <button type="button" className="back-link" onClick={onBack} data-cursor="interactive"><ArrowLeft size={16} /> 返回文章列表</button>
      <Reveal>
        <div className="article-detail-heading">
          <span className="eyebrow">{article.category} / {article.date}</span>
          <h1>{article.title}</h1>
          <p>{article.readTime}</p>
        </div>
      </Reveal>
      <Reveal className="article-body" delay={0.08}>
        {paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p key={`${article.id}-${index}`}>{paragraph}</p>) : <p>文章内容待添加。</p>}
      </Reveal>
      <Reveal className="comment-section" delay={0.12}>
        <div className="panel-label">RESPONSES / 留言</div>
        <h2>留下你的想法</h2>
        <div className="comment-form">
          <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="你的昵称" aria-label="你的昵称" />
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="写下你的评论..." aria-label="写下你的评论" />
          <button type="button" className="button button-primary" onClick={addComment} disabled={!author.trim() || !comment.trim()} data-cursor="interactive">发布留言 <Send size={16} /></button>
        </div>
        <div className="comment-list">
          {comments.length === 0 ? <p className="empty-note">还没有留言，欢迎留下第一句话。</p> : comments.map((item) => <div key={item.id} className="comment-item"><div><strong>{item.author}</strong><span>{item.date}</span></div><p>{item.content}</p></div>)}
        </div>
      </Reveal>
    </div>
  );
}

function PodcastsView() {
  return (
    <div className="page-view podcasts-view">
      <Reveal><SectionHeading eyebrow="AUDIO / 声音记录" title="叁水漫聊" description="和朋友聊天，也和正在变化的自己聊天。" /></Reveal>
      <div className="podcast-list">
        {PODCASTS.map((podcast, index) => (
          <Reveal key={podcast.id} delay={index * 0.05}>
            <a className="podcast-card" href={podcast.link} target="_blank" rel="noreferrer" data-cursor="interactive">
              <span className="podcast-number">0{index + 1}</span>
              <span className="podcast-play"><Play size={17} fill="currentColor" /></span>
              <span className="podcast-content"><span className="podcast-meta">{podcast.date} / {podcast.duration}</span><strong>{podcast.title}</strong><small>{podcast.description}</small></span>
              <ArrowUpRight className="podcast-arrow" size={20} />
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

type SearchItem = { id: string; title: string; kind: '项目' | '文章' | '播客'; description?: string; excerpt?: string; date?: string; year?: string };

function SearchOverlay({
  open,
  query,
  setQuery,
  results,
  onClose,
  onSelect,
}: {
  open: boolean;
  query: string;
  setQuery: (query: string) => void;
  results: SearchItem[];
  onClose: () => void;
  onSelect: (item: SearchItem) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="search-backdrop" aria-label="关闭搜索" onClick={onClose} />
          <motion.div className="search-dialog" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <div className="search-dialog-top"><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目、文章、播客" /><button type="button" onClick={onClose} aria-label="关闭搜索" data-cursor="interactive"><X size={21} /></button></div>
            <div className="search-results">
              {query.trim() === '' ? <p className="empty-note">输入关键词开始搜索</p> : results.length === 0 ? <p className="empty-note">没有找到匹配内容</p> : results.map((item) => <button type="button" key={`${item.kind}-${item.id}`} className="search-result" onClick={() => onSelect(item)} data-cursor="interactive"><span>{item.kind}</span><strong>{item.title}</strong><small>{item.year ?? item.date}</small></button>)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const NAV_ITEMS: Array<{ page: Page; label: string; icon: typeof UserRound }> = [
  { page: 'home', label: '首页', icon: Sparkles },
  { page: 'about', label: '关于', icon: UserRound },
  { page: 'projects', label: '作品', icon: Code2 },
  { page: 'articles', label: '文章', icon: BookOpen },
  { page: 'podcasts', label: '播客', icon: Mic2 },
];

export default function RedesignedApp() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navHidden = useScrollDirection();
  const { mode, setMode, resolvedTheme } = useBeijingTheme();

  const dismissSplash = useCallback(() => setSplashVisible(false), []);

  useEffect(() => {
    const timer = window.setTimeout(dismissSplash, 1000);
    return () => window.clearTimeout(timer);
  }, [dismissSplash]);

  useEffect(() => {
    if (!splashVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [splashVisible]);

  const goTo = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedProject(null);
    setSelectedArticle(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProjects = useCallback((category?: string) => {
    if (category) setActiveCategory(category);
    setSelectedProject(null);
    setSelectedArticle(null);
    setMobileMenuOpen(false);
    setCurrentPage('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setSelectedArticle(null);
    setCurrentPage('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setSelectedProject(null);
    setCurrentPage('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchItems = useMemo<SearchItem[]>(() => [
    ...PROJECTS.map((item) => ({ ...item, kind: '项目' as const })),
    ...ARTICLES.map((item) => ({ ...item, kind: '文章' as const })),
    ...PODCASTS.map((item) => ({ ...item, kind: '播客' as const })),
  ], []);

  const searchResults = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return [];
    return searchItems.filter((item) => `${item.title} ${item.description ?? ''} ${item.excerpt ?? ''} ${item.kind}`.toLowerCase().includes(needle));
  }, [searchItems, searchQuery]);

  const selectSearchResult = (item: SearchItem) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (item.kind === '文章') {
      const article = ARTICLES.find((entry) => entry.id === item.id);
      if (article) openArticle(article);
    } else if (item.kind === '项目') {
      const project = PROJECTS.find((entry) => entry.id === item.id);
      if (project) openProject(project);
    } else {
      goTo('podcasts');
    }
  };

  const pageKey = `${currentPage}-${selectedProject?.id ?? ''}-${selectedArticle?.id ?? ''}`;
  const activePage = currentPage === 'article-detail' ? 'articles' : currentPage;

  const renderPage = () => {
    if (selectedProject) return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />;
    if (selectedArticle) return <ArticleDetailView article={selectedArticle} onBack={() => { setSelectedArticle(null); setCurrentPage('articles'); }} />;
    if (currentPage === 'home') return <HomeView onNavigate={goTo} onOpenProjects={openProjects} />;
    if (currentPage === 'about') return <AboutView />;
    if (currentPage === 'projects') return <ProjectsView activeCategory={activeCategory} onCategoryChange={setActiveCategory} onProjectOpen={openProject} />;
    if (currentPage === 'articles') return <ArticlesView onArticleOpen={openArticle} />;
    return <PodcastsView />;
  };

  return (
    <div className={`site-shell theme-${resolvedTheme}`}>
      <AnimatePresence>{splashVisible && <SplashScreen onSkip={dismissSplash} />}</AnimatePresence>
      <CursorFollower />
      <header className={`site-header ${navHidden ? 'is-hidden' : ''}`}>
        <div className="site-header-inner">
          <button type="button" className="brand-mark" onClick={() => goTo('home')} data-cursor="interactive" aria-label="回到首页">
            <span>浩天淼</span><small>PORTFOLIO</small>
          </button>
          <nav className="desktop-nav" aria-label="主导航">
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button type="button" key={page} className={activePage === page ? 'is-active' : ''} onClick={() => goTo(page)} data-cursor="interactive">
                <Icon size={15} strokeWidth={1.7} /> <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <ThemeControl mode={mode} setMode={setMode} />
            <button type="button" className="icon-button" onClick={() => setSearchOpen(true)} aria-label="搜索" title="搜索" data-cursor="interactive"><Search size={18} /></button>
            <a className="icon-button github-button" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="打开 GitHub" title="GitHub" data-cursor="interactive"><Github size={18} /></a>
          </div>
          <button type="button" className="mobile-menu-button" aria-label={mobileMenuOpen ? '关闭导航' : '打开导航'} title="导航" onClick={() => setMobileMenuOpen((open) => !open)} data-cursor="interactive">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu-panel" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
              <button type="button" key={page} className={activePage === page ? 'is-active' : ''} onClick={() => goTo(page)} data-cursor="interactive">
                <Icon size={17} strokeWidth={1.7} /> <span>{label}</span>
              </button>
            ))}
            <ThemeControl mode={mode} setMode={setMode} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`site-main${activePage === 'home' ? ' site-main-home' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pageKey} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="mobile-nav" aria-label="移动端导航">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
          <button type="button" key={page} className={activePage === page ? 'is-active' : ''} onClick={() => goTo(page)} data-cursor="interactive" aria-label={label} title={label}><Icon size={18} strokeWidth={1.7} /><span>{label}</span></button>
        ))}
      </nav>

      <footer className="site-footer">
        <div><strong>浩天淼</strong><span>持续迭代，持续成长，持续向前。</span></div>
        <a href="mailto:2587944602@qq.com" data-cursor="interactive">2587944602@qq.com <ArrowUpRight size={15} /></a>
        <span>© 2026 / Made with care</span>
      </footer>

      <SearchOverlay open={searchOpen} query={searchQuery} setQuery={setSearchQuery} results={searchResults} onClose={() => { setSearchOpen(false); setSearchQuery(''); }} onSelect={selectSearchResult} />
    </div>
  );
}
