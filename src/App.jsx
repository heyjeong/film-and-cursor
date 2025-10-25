import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [screenSize, setScreenSize] = useState('mobile'); // mobile, tablet, desktop, fullhd, 4k
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [centerImages, setCenterImages] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage, default to 'jp'
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'jp';
  }); // 'en', 'kor', or 'jp'
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const imageRefs = useRef([]);

  // Load uploaded images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem('uploadedImages');
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Failed to load saved images:', error);
      }
    }
  }, []);

  // Save uploaded images to localStorage whenever they change
  useEffect(() => {
    if (uploadedImages.length > 0) {
      try {
                          // Save images to localStorage (removed harsh size limitation)
                  const compressedImages = uploadedImages.map(img => ({
                    ...img,
                    src: img.src // Keep full image quality
                  }));
        
        localStorage.setItem('uploadedImages', JSON.stringify(compressedImages));
        console.log('Images saved to localStorage successfully');
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
        if (error.name === 'QuotaExceededError') {
          setUploadError('Storage limit reached. Please remove some images before uploading more.');
        }
      }
    } else {
      localStorage.removeItem('uploadedImages');
    }
  }, [uploadedImages]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    console.log('Language changed to:', language);
  }, [language]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 3840) {
        setScreenSize('4k');
      } else if (width >= 1920) {
        setScreenSize('fullhd');
      } else if (width >= 1280) {
        setScreenSize('desktop');
      } else if (width >= 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('mobile');
      }
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
    if (screenSize === 'mobile' || screenSize === 'tablet') return;

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
  }, [screenSize]);

  // Infinite Loop 스크롤 효과
  useEffect(() => {
    if (screenSize === 'mobile' || screenSize === 'tablet') return;

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
  }, [screenSize]);

  useEffect(() => {
    if (screenSize === 'mobile' || screenSize === 'tablet') return;

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
    
    // 초기 
    // 체크
    checkImageVisibility();

    return () => {
      container.removeEventListener('scroll', checkImageVisibility);
    };
  }, [screenSize]);

  // 모바일/태블릿용 스크롤 감지
  useEffect(() => {
    if (screenSize === 'desktop' || screenSize === 'fullhd' || screenSize === '4k') return;

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
  }, [screenSize]);

  const addImageRef = (el, index) => {
    imageRefs.current[index] = el;
  };

  // Parallax 효과 계산 함수
  const getParallaxStyle = (index) => {
    if (screenSize === 'mobile' || screenSize === 'tablet') {
      // 세로 스크롤일 때는 마우스 Y 위치에 따라 세로 이동
      const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.02;
      return { transform: `translateY(${parallaxY}px)` };
    } else {
      // 가로 스크롤일 때는 마우스 X 위치에 따라 가로 이동
      const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.02;
      return { transform: `translateX(${parallaxX}px)` };
    }
  };

  // 해상도별 스타일 설정
  const getResponsiveStyles = () => {
    switch (screenSize) {
      case '4k':
        return {
          headerPadding: 'py-12',
          headerFontSize: 'text-2xl',
          imageGap: 'gap-24',
          containerPadding: 'px-24',
          baseImageWidth: 600,
          centerImageWidth: 900,
          baseImageWidthMobile: 400,
          centerImageWidthMobile: 500
        };
      case 'fullhd':
        return {
          headerPadding: 'py-10',
          headerFontSize: 'text-xl',
          imageGap: 'gap-20',
          containerPadding: 'px-20',
          baseImageWidth: 500,
          centerImageWidth: 750,
          baseImageWidthMobile: 350,
          centerImageWidthMobile: 438
        };
      case 'desktop':
        return {
          headerPadding: 'py-8',
          headerFontSize: 'text-base',
          imageGap: 'gap-16',
          containerPadding: 'px-16',
          baseImageWidth: 400,
          centerImageWidth: 600,
          baseImageWidthMobile: 300,
          centerImageWidthMobile: 375
        };
      case 'tablet':
        return {
          headerPadding: 'py-6',
          headerFontSize: 'text-sm',
          imageGap: 'gap-12',
          containerPadding: 'px-12',
          baseImageWidth: 300,
          centerImageWidth: 450,
          baseImageWidthMobile: 250,
          centerImageWidthMobile: 312
        };
      default: // mobile
        return {
          headerPadding: 'py-4',
          headerFontSize: 'text-xs',
          imageGap: 'gap-8',
          containerPadding: 'px-8',
          baseImageWidth: 250,
          centerImageWidth: 375,
          baseImageWidthMobile: 200,
          centerImageWidthMobile: 250
        };
    }
  };

  const styles = getResponsiveStyles();

  // Language content
  const content = {
    en: {
      title: "Bad Film Festival",
      uploadArea: {
        title: "Share your screwed films too!",
        formats: "Supported formats: PNG, JPEG, JPG",
        maxSize: "Maximum file size: 10MB per image"
      },
      toast: "Thanks for sharing your beautiful flop. It's in. 🎬",
      upload: {
        uploading: "Uploading...",
        error: {
          invalidType: "Invalid file type: {name}. Only PNG, JPEG, and JPG files are allowed.",
          tooLarge: "File too large: {name}. Maximum size is 10MB.",
          failed: "Failed to process {name}"
        }
      },
      modal: {
        close: "×"
      },
      delete: {
        title: "Are you really gonna hide your masterpiece?",
        subtitle: "We'll miss ur work of art :(",
        confirm: "yea, i wanna delete.",
        cancel: "well, i'll keep it for now",
        buttonTitle: "Remove image"
      }
    },
    kor: {
      title: "망한 필름 경연대회",
      uploadArea: {
        title: "망한 필름 사진 올려줘!",
        formats: "PNG, JPEG, JPG only",
        maxSize: "up to 10MB"
      },
      toast: "아름다운 망작을 공유해주셔서 감사합니다. 등록되었습니다. 🎬",
      upload: {
        uploading: "업로드 중...",
        error: {
          invalidType: "잘못된 파일 형식: {name}. PNG, JPEG, JPG 파일만 올려줘.",
          tooLarge: "파일이 너무 커용: {name}. 최대 크기는 10MB.",
          failed: "{name} 뭔가 문제가 있어요."
        }
      },
      modal: {
        close: "×"
      },
      delete: {
        title: "정말로 당신의 걸작을 숨길건가요?",
        subtitle: "당신의 작품이 벌써 보고싶네요... :(",
        confirm: "삭제할래요",
        buttonTitle: "이미지 삭제",
        cancel: "음, 일단 보관할게"
      }
    },
    jp: {
      title: "悪い映画祭",
      uploadArea: {
        title: "あなたの悪い映画を共有してください！",
        formats: "サポートフォーマット: PNG, JPEG, JPG",
        maxSize: "1枚あたりの最大ファイルサイズ: 10MB"
      },
      toast: "あなたの美しいフラップを共有してくれてありがとう！登録完了！ 🎬",
      upload: {
        uploading: "アップロード中...",
        error: {
          invalidType: "ファイルタイプが無効です: {name}。PNG、JPEG、JPGファイルのみを使用できます。",
          tooLarge: "ファイルが大きすぎます: {name}。最大サイズは10MBです。",
          failed: "{name} に問題が発生しました。"
        }
      },
      modal: {
        close: "×"
      },
      delete: {
        title: "本当にあなたの傑作を隠しますか？",
        subtitle: "あなたの作品はすでに見たいです... :(",
        confirm: "削除します",
        buttonTitle: "画像を削除",
        cancel: "ええと、とりあえず保存します"
      }
    }
  };

  const t = content[language]; // Current language content

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

  // Handle file upload
  const handleFileUpload = (event) => {
    // Prevent duplicate uploads
    if (isUploading) {
      console.log('Upload already in progress, ignoring duplicate call');
      return;
    }
    
    console.log('File upload triggered:', event.target.files);
    const files = Array.from(event.target.files);
    console.log('Files to process:', files);
    processFiles(files);
  };

  // Process uploaded files
  const processFiles = (files) => {
    // Prevent duplicate processing
    if (isUploading) {
      console.log('Already processing files, ignoring duplicate call');
      return;
    }
    
    console.log('Processing files:', files);
    setUploadError(null);
    const validFiles = files.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      
      if (!validTypes.includes(file.type)) {
        setUploadError(`Invalid file type: ${file.name}. Only PNG, JPEG, and JPG files are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        setUploadError(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    console.log('Valid files:', validFiles);
    if (validFiles.length === 0) {
      console.log('No valid files to process');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    let processedCount = 0;
    const totalFiles = validFiles.length;
    
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Compress the image to match existing image dimensions
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Get current screen size and target dimensions
          const currentStyles = getResponsiveStyles();
          const targetWidth = currentStyles.baseImageWidth;
          const targetHeight = Math.round(targetWidth * 0.663); // Same height as existing images
          
          // Calculate width to maintain original aspect ratio
          const originalAspectRatio = img.width / img.height;
          const newWidth = Math.round(targetHeight * originalAspectRatio);
          
          console.log(`Original dimensions: ${img.width} × ${img.height}px`);
          console.log(`Resizing to: ${newWidth} × ${targetHeight}px (maintaining aspect ratio)`);
          
          // Set canvas to new dimensions
          canvas.width = newWidth;
          canvas.height = targetHeight;
          
          // Draw and resize image maintaining original aspect ratio
          ctx.drawImage(img, 0, 0, newWidth, targetHeight);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.95); // 95% quality for high resolution
          
          const newImage = {
            src: compressedDataUrl,
            alt: `Uploaded ${file.name}`,
            isUploaded: true,
            name: file.name,
            size: file.size
          };
          
          console.log('Image compressed and ready:', newImage);
          setUploadedImages(prev => [...prev, newImage]);
          
          processedCount++;
          setUploadProgress((processedCount / totalFiles) * 100);
          
          if (processedCount === totalFiles) {
            setIsUploading(false);
            setUploadProgress(0);
            showToastMessage(); // Show success toast
          }
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        setUploadError(`Failed to process ${file.name}`);
        processedCount++;
        if (processedCount === totalFiles) {
          setIsUploading(false);
          setUploadProgress(0);
        }
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    // Prevent duplicate drops
    if (isUploading) {
      console.log('Upload already in progress, ignoring drop');
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Remove uploaded image
  const removeUploadedImage = (index) => {
    setImageToDelete(index);
    setShowDeleteModal(true);
  };

  // Actually delete the image after confirmation
  const confirmDeleteImage = () => {
    if (imageToDelete !== null) {
      setUploadedImages(prev => prev.filter((_, i) => i !== imageToDelete));
      setImageToDelete(null);
      setShowDeleteModal(false);
    }
  };

  // Cancel delete operation
  const cancelDeleteImage = () => {
    setImageToDelete(null);
    setShowDeleteModal(false);
  };

  // Clear all uploaded images and localStorage
  const clearAllUploadedImages = () => {
    setUploadedImages([]);
    try {
      localStorage.removeItem('uploadedImages');
      console.log('All images cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  // Open image modal
  const openImageModal = (image, index) => {
    setSelectedImage({ ...image, index });
    setIsModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Navigate to previous image
  const goToPreviousImage = () => {
    if (selectedImage && selectedImage.index > 0) {
      const prevImage = displayImages[selectedImage.index - 1];
      setSelectedImage({ ...prevImage, index: selectedImage.index - 1 });
    }
  };

  // Navigate to next image
  const goToNextImage = () => {
    if (selectedImage && selectedImage.index < displayImages.length - 1) {
      const nextImage = displayImages[selectedImage.index + 1];
      setSelectedImage({ ...nextImage, index: selectedImage.index + 1 });
    }
  };

  // Show toast notification
  const showToastMessage = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000); // Hide after 4 seconds
  };

  // Combine uploaded images first, then original images
  const allImages = [...uploadedImages, ...images];

  // Show images only once (no infinite loop)
  const displayImages = allImages;
  


  return (
    <main className="min-h-screen bg-[#121212] text-white antialiased relative">
      {/* Header Title */}
      <header className={`text-center ${styles.headerPadding} relative`}>
        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'kor' : language === 'kor' ? 'jp' : 'en')}
            className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            style={{ opacity: 0.7 }}
          >
            {language === 'en' ? '한국어' : language === 'kor' ? '日本語' : 'English'}
          </button>
        </div>
        
        <h1 className={`${styles.headerFontSize} font-bold text-white tracking-wider text-sm`} style={{ opacity: 0.7 }}>
          {t.title}
        </h1>
      </header>

      {/* Image Gallery */}
      <section id="works" className="max-w-none mx-auto px-0 py-12">
        {screenSize === 'desktop' || screenSize === 'fullhd' || screenSize === '4k' ? (
          // 데스크톱 이상: 가로 스크롤 (마우스 휠로 자동, 스크롤 시 확대, 무한반복)
          <div 
            ref={scrollContainerRef}
            className={`flex overflow-x-auto ${styles.imageGap} items-center ${styles.containerPadding} scrollbar-hide`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              perspective: '1000px',
              minHeight: '70vh'
            }}
          >
            {/* 중앙 정렬을 위한 여백 */}
            <div className="flex-shrink-0" style={{ width: '25vw' }}></div>
            
            {displayImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  ref={(el) => addImageRef(el, index)}
                  src={image.src} 
                  alt={image.alt} 
                  onClick={() => openImageModal(image, index)}
                  className={`object-cover transition-all duration-700 ease-out flex-shrink-0 cursor-pointer hover:scale-105 ${
                    visibleImages.has(index) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-8'
                  } ${
                    centerImages.has(index) ? 'scale-150 z-10' : 'scale-100'
                  }`} 
                  style={{
                    width: centerImages.has(index) ? `${styles.centerImageWidth}px` : `${styles.baseImageWidth}px`,
                    maxWidth: centerImages.has(index) ? `${styles.centerImageWidth}px` : `${styles.baseImageWidth}px`,
                    height: 'auto',
                    ...getParallaxStyle(index)
                  }} 
                />
                
                {/* Remove button for uploaded images */}
                {image.isUploaded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const originalIndex = uploadedImages.findIndex(img => img.src === image.src);
                      if (originalIndex !== -1) {
                        removeUploadedImage(originalIndex);
                      }
                    }}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-gray-600 rounded w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 "
                    title={t.delete.buttonTitle}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>{language === "en" ? "delete?" : "삭제할래요"}
                  </button>
                )}
              </div>
            ))}
            
            {/* Upload Area - Last item in the desktop gallery */}
            <div className="flex-shrink-0">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  // Prevent rapid clicking
                  if (isUploading) return;
                  
                  console.log('Desktop upload area clicked');
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="border-2 border-dashed rounded-lg transition-all duration-200 hover:border-gray-300 cursor-pointer flex flex-col items-center justify-center"
                style={{
                  width: `${styles.baseImageWidth}px`,
                  height: `${styles.baseImageWidth * 0.663}px`,
                  borderRadius: '8px',
                  borderColor: 'rgba(156, 163, 175, 0.5)'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <svg className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium mb-2" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>{t.uploadArea.title}</p>
                  <div className="text-center space-y-1">
                    <p className="text-sm" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                      {t.uploadArea.formats}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                      {t.uploadArea.maxSize}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 중앙 정렬을 위한 여백 */}
            <div className="flex-shrink-0" style={{ width: '50vw' }}></div>
          </div>
          
        ) : (
          // 태블릿/모바일: 세로 스크롤 (기본 크기, 스크롤 시 확대, 무한반복)
          <div 
            className={`flex flex-col justify-center items-center ${styles.imageGap} ${styles.headerPadding}`}
            style={{ 
              perspective: '1000px',
              minHeight: '70vh'
            }}
          >
                        {displayImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  ref={(el) => addImageRef(el, index)}
                  src={image.src} 
                  alt={image.alt} 
                  onClick={() => openImageModal(image, index)}
                  className={`object-cover transition-all duration-700 ease-out cursor-pointer hover:scale-105 ${
                    visibleImages.has(index) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'
                  } ${
                    centerImages.has(index) ? 'scale-125 z-10' : 'scale-100'
                  }`} 
                  style={{
                    width: centerImages.has(index) ? `${styles.centerImageWidthMobile}px` : `${styles.baseImageWidthMobile}px`,
                    maxWidth: centerImages.has(index) ? `${styles.centerImageWidthMobile}px` : `${styles.baseImageWidthMobile}px`,
                    height: 'auto',
                    ...getParallaxStyle(index)
                  }} 
                />
                
                {/* Remove button for uploaded images */}
                {image.isUploaded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const originalIndex = uploadedImages.findIndex(img => img.src === image.src);
                      if (originalIndex !== -1) {
                        removeUploadedImage(originalIndex);
                      }
                    }}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-gray-600 rounded w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 "
                    title={t.delete.buttonTitle}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>{language === "en" ? "delete?" : language === "kor" ? "삭제할래요" : "削除？"}
                  </button>
                )}
              </div>
            ))}
            
            {/* Upload Area - Last item in the mobile gallery */}
            <div className="flex justify-center">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  // Prevent rapid clicking
                  if (isUploading) return;
                  
                  console.log('Mobile upload area clicked');
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="border-2 border-dashed rounded-lg transition-all duration-200 hover:border-gray-300 cursor-pointer flex flex-col items-center justify-center"
                style={{
                  width: `${styles.baseImageWidthMobile}px`,
                  height: `${styles.baseImageWidthMobile * 0.663}px`,
                  borderRadius: '8px',
                  borderColor: 'rgba(156, 163, 175, 0.5)'
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload-mobile"
                />
                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <svg className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-base font-medium mb-2" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>{t.uploadArea.title}</p>
                  <div className="text-center space-y-1">
                    <p className="text-xs" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                      {t.uploadArea.formats}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(156, 163, 175, 0.5)' }}>
                      {t.uploadArea.maxSize}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        )}
        
        {/* Upload Progress and Status for All Screen Sizes */}
        <div className="flex justify-center mt-8">
          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {uploadError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg max-w-md text-center">
              <p className="text-sm">{uploadError}</p>
              <button
                onClick={() => setUploadError(null)}
                className="mt-2 text-red-300 hover:text-red-100 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            className="text-white px-6 py-4 rounded-lg flex items-center space-x-3 animate-fade-in cursor-pointer transition-all duration-200"
            onClick={() => setShowToast(false)}
          >
            <span className="text-2xl">🎬</span>
            <p className="text-sm font-medium">
              Thanks for sharing your beautiful flop. It's in.
            </p>
          </div>
        </div>
      )}

      {/* Image Modal/Lightbox */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          {/* Left Navigation Area */}
          {selectedImage.index > 0 && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const prevImage = displayImages[selectedImage.index - 1];
                setSelectedImage({ ...prevImage, index: selectedImage.index - 1 });
              }}
            />
          )}

          {/* Right Navigation Area */}
          {selectedImage.index < displayImages.length - 1 && (
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const nextImage = displayImages[selectedImage.index + 1];
                setSelectedImage({ ...nextImage, index: selectedImage.index + 1 });
              }}
            />
          )}

          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-light z-10 transition-all duration-200 hover:scale-110 cursor-pointer w-10 h-10 flex items-center justify-center"
              style={{ opacity: 0.5 }}
            >
              ×
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white bg-opacity-70 text-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{t.delete.title}</h3>
              <p className="text-gray-600 mb-6">{t.delete.subtitle}</p>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={confirmDeleteImage}
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  style={{ borderRadius: '999px' }}
                >
                  {t.delete.confirm}
                </button>
                <button
                  onClick={cancelDeleteImage}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors duration-200"
                  style={{ borderRadius: '999px' }}
                >
                  {t.delete.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
