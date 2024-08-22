'use client'
import React, { useState } from 'react';

interface Article {
  title: string;
  content: string;
  // Other fields as needed
}

interface TrendingCarouselProps {
  articles_: Article[];
}

const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ articles_ }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? articles_.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === articles_.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-lg shadow-lg">
        {articles_.map((article, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ transform: `translateX(${100 * (index - currentIndex)}%)` }}
          >
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-2">{article.title}</h3>
              <p>{article.content}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

export default TrendingCarousel;