/**
 * Enhanced Hero Section
 *
 * Modern portfolio hero section with dark theme, animations, and carousel
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ArrowRight, Github, Linkedin, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample projects data - replace with real data from Redux
const sampleProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Next.js 기반 풀스택 이커머스 플랫폼. Stripe 결제 연동 및 관리자 대시보드 구현',
    tech: ['Next.js', 'TypeScript', 'Tailwind'],
    image: null,
  },
  {
    id: 2,
    title: 'Real-time Chat App',
    description: 'WebSocket 기반 실시간 채팅 애플리케이션. 그룹 채팅 및 파일 공유 기능',
    tech: ['React', 'Socket.io', 'Node.js'],
    image: null,
  },
  {
    id: 3,
    title: 'Portfolio CMS',
    description: '포트폴리오 및 블로그 관리 시스템. Supabase 인증 및 CMS 기능 통합',
    tech: ['React', 'Supabase', 'Redux'],
    image: null,
  },
  {
    id: 4,
    title: 'Task Management',
    description: 'Trello 스타일의 태스크 관리 도구. 드래그 앤 드롭 및 실시간 동기화',
    tech: ['React', 'DnD Kit', 'Firebase'],
    image: null,
  },
  {
    id: 5,
    title: 'Weather Dashboard',
    description: '날씨 API를 활용한 대시보드. 차트 및 지도 시각화 포함',
    tech: ['React', 'Chart.js', 'Leaflet'],
    image: null,
  },
  {
    id: 6,
    title: 'Social Media Clone',
    description: 'Instagram 스타일의 소셜 미디어. 이미지 업로드 및 좋아요, 댓글 기능',
    tech: ['React', 'Express', 'MongoDB'],
    image: null,
  },
];

export const EnhancedHeroSection: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="bg-[#0a0a0f] -mt-20">
      {/* Hero Section */}
      <Section spacing="none" className="relative min-h-screen flex items-center justify-center py-32 px-6 md:px-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs - Darker Purple */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <Container className="relative z-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Badge
              variant="outline"
              size="lg"
              className="px-4 py-2 text-sm font-medium border-purple-600/30 bg-purple-700/10 text-purple-300"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              Available for opportunities
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <span className="block text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none mb-4">
              프론트엔드
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none bg-gradient-to-r from-purple-400/90 to-cyan-400/90 bg-clip-text text-transparent">
              개발자 포트폴리오
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center text-xl md:text-2xl lg:text-3xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed"
          >
            사용자 경험을 최우선으로 생각하며,
            <span className="text-purple-400 font-medium"> 모던하고 인터랙티브한 </span>
            웹 애플리케이션을 만듭니다.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link to="/projects">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-700 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-semibold px-8 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center">
                  프로젝트 보기
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            <a href="/resume.pdf" download>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-600/30 bg-purple-700/5 hover:bg-purple-700/10 text-white font-semibold px-8 py-6 text-lg backdrop-blur-sm"
              >
                이력서 다운로드
              </Button>
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-6"
          >
            {[
              { icon: Github, href: 'https://github.com', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:example@email.com', label: 'Email' },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="group relative p-3 rounded-full border border-purple-600/30 bg-purple-700/5 hover:bg-purple-700/10 hover:border-purple-600/50 transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />

                {/* Hover Glow Effect */}
                <span className="absolute inset-0 rounded-full bg-purple-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-sm font-medium">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-purple-600/50 to-transparent" />
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Projects Preview Section - Carousel */}
      <Section className="py-32 px-6 md:px-12 bg-[#0a0a0f]">
        <Container size="xl" className="max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">주요 프로젝트</h2>
            <p className="text-xl text-gray-400">최근 작업한 프로젝트들을 확인해보세요</p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel Navigation */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-purple-700/20 border border-purple-600/30 backdrop-blur-sm hover:bg-purple-700/30 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6 text-purple-400" />
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-purple-700/20 border border-purple-600/30 backdrop-blur-sm hover:bg-purple-700/30 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6 text-purple-400" />
            </button>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {sampleProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-purple-600/20 bg-gradient-to-br from-purple-700/5 to-cyan-600/5 p-6 backdrop-blur-sm hover:border-purple-600/40 transition-all h-full">
                      {/* Card Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        {/* Project Image Placeholder */}
                        <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-900/50 to-cyan-900/50 mb-4 group-hover:scale-105 transition-transform flex items-center justify-center">
                          <span className="text-4xl font-bold text-purple-300/30">#{project.id}</span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="border-purple-600/30 bg-purple-700/10 text-purple-400"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
