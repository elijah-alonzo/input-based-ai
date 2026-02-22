"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import HTMLFlipBook from "react-pageflip";
import { useArticleStore } from "@/lib/article-store";

interface PageProps {
  children: React.ReactNode;
}

const Page = ({ children }: PageProps) => (
  <div className="bg-white shadow-lg border border-gray-200 h-full flex flex-col relative">
    {children}
  </div>
);

// Sample images for demonstration - you can replace with actual article images
const sampleImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop",
];

export default function FlipbookPage() {
  const router = useRouter();
  const articles = useArticleStore((state) => state.articles);
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const prevPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.getPageFlip().flipPrev();
    }
  }, []);

  const nextPage = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.getPageFlip().flipNext();
    }
  }, []);

  const onPageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const handleAddNewArticle = () => {
    router.push("/generate");
  };

  const totalPages = articles.length + 2; // +2 for cover and back cover

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-4">
              Flipbook Page
            </h1>
          </div>
          <button
            onClick={handleAddNewArticle}
            className="bg-black text-white py-2 px-6 rounded hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            Add Page
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-black mb-2">
              No Articles Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first article to start building your flipbook
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              <HTMLFlipBook
                ref={flipBookRef}
                width={450}
                height={650}
                size="stretch"
                minWidth={350}
                maxWidth={1000}
                minHeight={500}
                maxHeight={1400}
                maxShadowOpacity={0.3}
                showCover={true}
                mobileScrollSupport={true}
                className="flipbook"
                style={{
                  background: "transparent",
                }}
                startPage={0}
                drawShadow={true}
                flippingTime={800}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                onFlip={onPageFlip}
                onChangeOrientation={() => {}}
                onChangeState={() => {}}
              >
                {/* Cover Page */}
                <Page>
                  <div className="p-8 flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-6xl mb-6">📖</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      Article Collection
                    </h1>
                    <div className="w-16 h-1 bg-blue-500 mb-4"></div>
                    <p className="text-xl text-gray-600 mb-6">
                      {articles.length} article
                      {articles.length !== 1 ? "s" : ""}
                    </p>
                    <div className="text-sm text-gray-500 italic">
                      Click to turn the page
                    </div>
                  </div>
                </Page>

                {/* Article Pages */}
                {articles.map((article, index) => (
                  <Page key={article.id}>
                    <div className="h-full flex flex-col">
                      {/* Page Header */}
                      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                          PAGE HEADER - {index + 1}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 overflow-hidden">
                        {/* Article Image */}
                        <div className="mb-4">
                          <img
                            src={sampleImages[index % sampleImages.length]}
                            alt={`Article ${index + 1} image`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              // Fallback to a gradient background if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-md flex items-center justify-center text-white font-medium";
                              fallback.textContent = "Article Image";
                              target.parentNode?.insertBefore(fallback, target);
                            }}
                          />
                        </div>

                        {/* Article Title */}
                        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                          {article.title}
                        </h2>

                        {/* Article Content */}
                        <div className="text-sm text-gray-700 leading-relaxed text-justify overflow-hidden">
                          <div className="line-clamp-12">
                            {article.content.substring(0, 800)}
                            {article.content.length > 800 && "..."}
                          </div>
                        </div>
                      </div>

                      {/* Page Footer */}
                      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            Created:{" "}
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span>{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </Page>
                ))}

                {/* Back Cover */}
                <Page>
                  <div className="p-8 flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-green-50 to-teal-100">
                    <div className="text-6xl mb-6">✨</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      The End
                    </h2>
                    <div className="w-16 h-1 bg-green-500 mb-6"></div>
                    <p className="text-lg text-gray-600 mb-4">
                      Thank you for reading!
                    </p>
                    <div className="text-sm text-gray-500 italic">
                      Add more articles to expand your collection
                    </div>
                  </div>
                </Page>
              </HTMLFlipBook>
            </div>

            {/* Enhanced Navigation Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <span>←</span>
                Previous page
              </button>

              <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700">
                <span className="font-bold">
                  {Math.floor(currentPage / 2) + 1}
                </span>{" "}
                of{" "}
                <span className="font-bold">{Math.ceil(totalPages / 2)}</span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Next page
                <span>→</span>
              </button>
            </div>

            {/* Usage Instructions */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Click pages or use navigation buttons • Drag to flip pages on
              mobile
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
