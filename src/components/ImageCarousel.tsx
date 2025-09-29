import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageCarouselProps {
  images: string[];
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = 'http://46.62.175.8/api';
  const imageUrl = images[currentIndex] ? `${baseUrl}${images[currentIndex]}` : 'https://via.placeholder.com/600x400?text=No+Image';

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={imageUrl}
          alt="Car"
          className="w-full h-96 object-cover rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
          >
            <FaChevronRight />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-400'}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <div className="flex overflow-x-auto mt-4 space-x-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={`${baseUrl}${img}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${index === currentIndex ? 'border-2 border-blue-600' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;