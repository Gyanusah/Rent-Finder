import React, { useState } from "react";
import { getImageUrl } from "../services/apiService";

export default function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-700 font-semibold">No images available</p>
          <p className="text-gray-600 text-sm">
            Images will appear here once uploaded
          </p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];
  const imageUrl = getImageUrl(currentImage?.url);

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-96 md:h-screen bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden group">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <div className="text-6xl mb-2">⚠️</div>
              <p className="text-gray-700">Image could not be loaded</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Property ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition opacity-0 group-hover:opacity-100 font-semibold flex items-center gap-2"
            >
              ← Prev
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition opacity-0 group-hover:opacity-100 font-semibold flex items-center gap-2"
            >
              Next →
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-semibold">
              📷 {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Image Counter for single image */}
        {images.length === 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-semibold">
            📷 1 / 1
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2 font-semibold">
            More Images
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition hover:opacity-80 ${
                  currentIndex === index
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title={`Image ${index + 1}`}
              >
                <img
                  src={getImageUrl(image.url)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
