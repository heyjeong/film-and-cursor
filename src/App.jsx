import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [centerImages, setCenterImages] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 1280);
    };

    // 초기 체크
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkScreenSize);

    // 클린업
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 마우스 움직임 추적 (Parallax 효과용)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isWideScreen || !scrollContainerRef.current) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const container = scrollContainerRef.current;
      container.scrollLeft += e.deltaY;
    };

    const container = scrollContainerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isWideScreen]);

  // Infinite Loop 스크롤 효과
  useEffect(() => {
    if (!isWideScreen || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      // 오른쪽 끝에 도달하면 왼쪽으로 순간이동
      if (scrollLeft + clientWidth >= scrollWidth - 100) {
        container.scrollLeft = 100;
      }
      
      // 왼쪽 끝에 도달하면 오른쪽으로 순간이동
      if (scrollLeft <= 100) {
        container.scrollLeft = scrollWidth - clientWidth - 100;
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isWideScreen]);

  useEffect(() => {
    if (!isWideScreen || !scrollContainerRef.current) return;

    const checkImageVisibility = () => {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const newVisibleImages = new Set();
      const newCenterImages = new Set();

      // 가장 중앙에 가까운 이미지 하나만 찾기
      let closestImageIndex = -1;
      let minDistance = Infinity;

      imageRefs.current.forEach((imgRef, index) => {
        if (imgRef) {
          const imgRect = imgRef.getBoundingClientRect();
          const imgCenter = imgRect.left + imgRect.width / 2;
          const isVisible = 
            imgRect.left < containerRect.right && 
            imgRect.right > containerRect.left;

          if (isVisible) {
            newVisibleImages.add(index);
            
            // 이미지가 컨테이너 중앙에 가까우면 거리 계산
            const distanceFromCenter = Math.abs(imgCenter - containerCenter);
            if (distanceFromCenter < 200) { // 200px 이내면 중앙으로 간주
              if (distanceFromCenter < minDistance) {
                minDistance = distanceFromCenter;
                closestImageIndex = index;
              }
            }
          }
        }
      });

      // 가장 중앙에 가까운 이미지만 확대
      if (closestImageIndex !== -1) {
        newCenterImages.add(closestImageIndex);
      }

      setVisibleImages(newVisibleImages);
      setCenterImages(newCenterImages);
    };

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', checkImageVisibility);
    
    // 초기 체크
    checkImageVisibility();

    return () => {
      container.removeEventListener('scroll', checkImageVisibility);
    };
  }, [isWideScreen]);

  // 모바일/태블릿용 스크롤 감지
  useEffect(() => {
    if (isWideScreen) return;

    const checkMobileImageVisibility = () => {
      const newVisibleImages = new Set();
      const newCenterImages = new Set();
      const viewportCenter = window.innerHeight / 2;

      // 가장 중앙에 가까운 이미지 하나만 찾기
      let closestImageIndex = -1;
      let minDistance = Infinity;

      imageRefs.current.forEach((imgRef, index) => {
        if (imgRef) {
          const imgRect = imgRef.getBoundingClientRect();
          const imgCenter = imgRect.top + imgRect.height / 2;
          const isVisible = 
            imgRect.top < window.innerHeight && 
            imgRect.bottom > 0;

          if (isVisible) {
            newVisibleImages.add(index);
            
            // 이미지가 뷰포트 중앙에 가까우면 거리 계산
            const distanceFromCenter = Math.abs(imgCenter - viewportCenter);
            if (distanceFromCenter < 200) { // 200px 이내면 중앙으로 간주
              if (distanceFromCenter < minDistance) {
                minDistance = distanceFromCenter;
                closestImageIndex = index;
              }
            }
          }
        }
      });

      // 가장 중앙에 가까운 이미지만 확대
      if (closestImageIndex !== -1) {
        newCenterImages.add(closestImageIndex);
      }

      setVisibleImages(newVisibleImages);
      setCenterImages(newCenterImages);
    };

    window.addEventListener('scroll', checkMobileImageVisibility);
    
    // 초기 체크
    checkMobileImageVisibility();

    return () => {
      window.removeEventListener('scroll', checkMobileImageVisibility);
    };
  }, [isWideScreen]);

  const addImageRef = (el, index) => {
    imageRefs.current[index] = el;
  };

  // Parallax 효과 계산 함수
  const getParallaxStyle = (index) => {
    if (isWideScreen) {
      // 가로 스크롤일 때는 마우스 X 위치에 따라 가로 이동
      const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.02;
      return { transform: `translateX(${parallaxX}px)` };
    } else {
      // 세로 스크롤일 때는 마우스 Y 위치에 따라 세로 이동
      const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.02;
      return { transform: `translateY(${parallaxY}px)` };
    }
  };

  const images = [
    { src: "/0002.jpg", alt: "Image 1" },
    { src: "/0003.jpg", alt: "Image 2" },
    { src: "/0004.jpg", alt: "Image 3" },
    { src: "/0005.jpg", alt: "Image 4" },
    { src: "/0006.jpg", alt: "Image 5" },
    { src: "/0007.jpg", alt: "Image 6" },
    { src: "/0008.jpg", alt: "Image 7" },
    { src: "/0009.jpg", alt: "Image 8" },
    { src: "/0010.jpg", alt: "Image 9" },
    { src: "/0012.jpg", alt: "Image 11" },
    { src: "/0014.jpg", alt: "Image 13" },
    { src: "/0015.jpg", alt: "Image 14" },
    { src: "/0016.jpg", alt: "Image 15" },
    { src: "/0017.jpg", alt: "Image 16" },
    { src: "/0018.jpg", alt: "Image 17" },
    { src: "/0019.jpg", alt: "Image 18" },
    { src: "/0020.jpg", alt: "Image 19" },
    { src: "/0021.jpg", alt: "Image 20" }
  ];

  // Infinite Loop를 위한 이미지 배열 (3번 반복)
  const infiniteImages = [...images, ...images, ...images];

  return (
    <main className="min-h-screen bg-[#121212] text-white antialiased relative">
      {/* Header Title */}
      <header className="text-center py-8">
        <h1 className="text-xs font-medium text-gray-300 tracking-wide">
          망한 필름 경연대회
        </h1>
      </header>

      {/* Image Gallery */}
      <section id="works" className="max-w-none mx-auto px-0 py-20">
        {isWideScreen ? (
          // 1280px 이상: 가로 스크롤 (마우스 휠로 자동, 스크롤 시 확대, 무한반복)
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-16 min-h-screen items-center px-16 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              perspective: '1000px'
            }}
          >
            {infiniteImages.map((image, index) => (
              <img 
                key={index}
                ref={(el) => addImageRef(el, index)}
                src={image.src} 
                alt={image.alt} 
                className={`object-cover transition-all duration-700 ease-out flex-shrink-0 cursor-pointer ${
                  visibleImages.has(index) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-8'
                } ${
                  centerImages.has(index) ? 'scale-150 z-10' : 'scale-100'
                }`} 
                style={{
                  width: centerImages.has(index) ? '600px' : '400px',
                  maxWidth: centerImages.has(index) ? '600px' : '400px',
                  height: 'auto',
                  ...getParallaxStyle(index)
                }} 
              />
            ))}
          </div>
        ) : (
          // 1279px 이하: 세로 스크롤 (기본 300px, 스크롤 시 1.25배, 무한반복)
          <div 
            className="flex flex-col justify-center items-center gap-8 min-h-screen py-40"
            style={{ perspective: '1000px' }}
          >
            {infiniteImages.map((image, index) => (
              <img 
                key={index}
                ref={(el) => addImageRef(el, index)}
                src={image.src} 
                alt={image.alt} 
                className={`object-cover transition-all duration-700 ease-out ${
                  visibleImages.has(index) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'
                } ${
                  centerImages.has(index) ? 'scale-125 z-10' : 'scale-100'
                }`} 
                style={{
                  width: centerImages.has(index) ? '375px' : '300px',
                  maxWidth: centerImages.has(index) ? '375px' : '300px',
                  height: 'auto',
                  ...getParallaxStyle(index)
                }} 
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
