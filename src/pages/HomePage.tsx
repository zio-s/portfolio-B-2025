/**
 * Home/Landing Page
 *
 * Interactive portfolio landing page with animations
 * - GSAP ScrollTrigger animations
 * - Framer Motion 3D effects
 * - Shields.io badges with tooltips
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { SEO } from '@/components/common/SEO';
import { useGetProjectsQuery } from '../features/portfolio/api/projectsApi';
import { ROUTES } from '../router/routes';
import { skills, type Skill } from '@/data/skills';
// 개별 아이콘 직접 import (Tree-shaking 지원)
import AxiosPlain from 'devicons-react/lib/icons/AxiosPlain';
import Css3Original from 'devicons-react/lib/icons/Css3Original';
import FigmaOriginal from 'devicons-react/lib/icons/FigmaOriginal';
import FramermotionOriginal from 'devicons-react/lib/icons/FramermotionOriginal';
import GitOriginal from 'devicons-react/lib/icons/GitOriginal';
import JavascriptOriginal from 'devicons-react/lib/icons/JavascriptOriginal';
import NextjsOriginal from 'devicons-react/lib/icons/NextjsOriginal';
import ReactOriginal from 'devicons-react/lib/icons/ReactOriginal';
import ReduxOriginal from 'devicons-react/lib/icons/ReduxOriginal';
import SassOriginal from 'devicons-react/lib/icons/SassOriginal';
import TailwindcssOriginal from 'devicons-react/lib/icons/TailwindcssOriginal';
import TypescriptOriginal from 'devicons-react/lib/icons/TypescriptOriginal';
import ViteOriginal from 'devicons-react/lib/icons/ViteOriginal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

// 정적 아이콘 매핑 (Tree-shaking 최적화)
const iconMap: Record<string, React.ComponentType<{ size?: string }>> = {
  axios: AxiosPlain,
  css3: Css3Original,
  figma: FigmaOriginal,
  framermotion: FramermotionOriginal,
  git: GitOriginal,
  javascript: JavascriptOriginal,
  nextjs: NextjsOriginal,
  react: ReactOriginal,
  redux: ReduxOriginal,
  sass: SassOriginal,
  tailwindcss: TailwindcssOriginal,
  typescript: TypescriptOriginal,
  vite: ViteOriginal,
};

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // RTK Query로 프로젝트 목록 조회 (홈페이지에서는 featured만)
  const { data: projectsData } = useGetProjectsQuery({
    featured: true,
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    // 스킬 섹션 스크롤 애니메이션
    const skillCards = skillsRef.current?.querySelectorAll('.skill-badge');

    if (skillCards) {
      gsap.fromTo(
        skillCards,
        {
          opacity: 0,
          y: 50,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 섹션 페이드인 애니메이션
    gsap.utils.toArray<Element>('.fade-in-section').forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <MainLayout>
      <SEO />
      {/* Hero Section with Parallax & 3D */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-foreground/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-8 text-center sm:-mt-10 -mt-30"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-accent/60 via-accent to-purple-500 bg-clip-text text-transparent"
          >
            Frontend Developer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl text-muted-foreground mb-12 font-light"
          >
            사용자 경험을 최우선으로 생각하는 개발자
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            React와 TypeScript로 견고한 웹 애플리케이션을 만들고,
            <br />
            세심한 애니메이션으로 사용자에게 즐거움을 전달합니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link to={ROUTES.PROJECTS}>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                View Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to={ROUTES.BLOG}>
              <Button variant="outline" size="lg">
                Read Blog
              </Button>
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            {[
              { icon: Github, href: 'https://github.com/zio-s', label: '깃허브' },
              { icon: MessageCircle, href: 'https://open.kakao.com/o/sAtkrp1h', label: '오픈카톡' },
              { icon: Mail, href: 'mailto:zio.s.dev@gmail.com', label: '메일' }
            ].map(({ icon: Icon, href, label }) => (
              <Tooltip key={label} content={label} position="top">
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-card hover:bg-accent/10 transition-colors border border-border"
                  whileHover={{ y: 3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              </Tooltip>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-28 sm:bottom-28 left-1/2 -translate-x-1/2 "
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-border rounded-full p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-accent rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-32 px-8 relative fade-in-section bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
          >
            제가 사용하는 <span className="text-accent">스킬</span>입니다.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center mb-16 text-lg"
          >
          </motion.p>

          <div className="space-y-16">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => {
              const categoryDescriptions: Record<string, string> = {
                'Frontend': 'React와 TypeScript를 중심으로 컴포넌트 기반 아키텍처를 설계하고, 사용자 중심의 인터페이스를 구현합니다.',
                'Styling': 'Tailwind CSS로 빠른 프로토타이핑을, Sass로 복잡한 스타일 시스템을 효율적으로 관리합니다.',
                'State & API': '전역 상태 관리부터 서버 데이터 동기화까지, 안정적인 데이터 흐름을 설계합니다.',
                'Animation': 'GSAP과 Framer Motion으로 사용자의 시선을 사로잡는 인터랙티브한 경험을 만듭니다.',
                'Tools': 'Git으로 협업하고, Vite로 빌드하며, Figma로 디자인 시스템을 구체화합니다.'
              };

              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-foreground text-accent">
                      {category}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                    {categoryDescriptions[category]}
                  </p>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
                    {categorySkills.map((skill) => {
                      const IconComponent = iconMap[skill.icon];
                      return (
                        <Tooltip key={skill.name} position="bottom" content={skill.tooltip}>
                          <motion.div
                            className="skill-badge cursor-pointer flex flex-col items-center gap-2 p-2 rounded-lg border border-transparent hover:border-accent/50 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-10 h-10 flex items-center justify-center">
                              {IconComponent ? (
                                <IconComponent size="40" />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: skill.color, color: 'white' }}
                                >
                                  {skill.name.substring(0, 2)}
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">
                              {skill.name}
                            </span>
                          </motion.div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="py-32 px-8 fade-in-section bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-accent">Featured</span> Projects
            </h2>
            <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto font-medium">
              정성스럽게 개발한 프로젝트
            </p>
          </div>

          {projectsData && projectsData.items.length > 0 && (
            <div className="relative px-4 sm:px-16">
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1}
                centeredSlides={false}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                  disabledClass: 'swiper-button-disabled',
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 32,
                  },
                }}
                className="mb-8 home-projects-swiper"
              >
                {projectsData.items.map((project, index) => (
                  <SwiperSlide key={project.id}>
                    <ProjectCard
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      thumbnail={project.thumbnail}
                      tags={[project.category]}
                      techStack={project.techStack}
                      githubUrl={project.githubUrl}
                      liveUrl={project.liveUrl}
                      stats={project.stats}
                      featured={project.featured}
                      className={index === 0 ? 'ring-2 ring-accent/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : ''}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button className="swiper-button-prev-custom absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-border bg-card hover:bg-accent hover:border-accent transition-all flex items-center justify-center shadow-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="swiper-button-next-custom absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-border bg-card hover:bg-accent hover:border-accent transition-all flex items-center justify-center shadow-lg">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to={ROUTES.PROJECTS}>
              <Button variant="outline" size="lg" className="group">
                전체 프로젝트 보기
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8 relative overflow-hidden fade-in-section bg-card/30">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
            whileHover={{ scale: 1.02 }}
          >
            좋은 코드는 사용자의 <span className="text-accent">미소</span>에서 시작됩니다
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            함께 만들어가는 가치, 그 여정에 동참하세요
          </motion.p>
          <Link to={ROUTES.GUESTBOOK}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-2xl hover:shadow-accent/50 transition-all"
              >
                함께 일하실래요?
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
