"use client";

import { useRef, useCallback, useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import { useArticleStore } from "@/lib/article-store";

interface PageProps {
  children: React.ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children }, ref) => (
  <div
    ref={ref as React.Ref<HTMLDivElement>}
    className="bg-white h-full flex flex-col relative"
  >
    {children}
  </div>
));

Page.displayName = "Page";

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
      // Debug: Log available methods
      console.log(
        "FlipBook methods:",
        Object.getOwnPropertyNames(flipBookRef.current),
      );
      console.log(
        "FlipBook prototype methods:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(flipBookRef.current)),
      );

      // Try the method
      try {
        flipBookRef.current.turnToPrevPage();
      } catch (error) {
        console.error("turnToPrevPage failed:", error);
      }
    }
  }, []);

  const nextPage = useCallback(() => {
    if (flipBookRef.current) {
      // Try the method
      try {
        flipBookRef.current.turnToNextPage();
      } catch (error) {
        console.error("turnToNextPage failed:", error);
      }
    }
  }, []);

  const onPageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const handleAddNewArticle = () => {
    router.push("/generate");
  };

  const totalPages = articles.length; // Remove +2 since no cover pages

  // Function to format article text with proper paragraphs
  const formatArticleText = (content: string) => {
    const paragraphs = content.split("\n\n").filter((p) => p.trim());
    return paragraphs.slice(0, 3).map((paragraph, index) => (
      <p key={index} className="article-paragraph">
        {paragraph.trim()}
      </p>
    ));
  };

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
            <div className="book-container">
              <HTMLFlipBook
                ref={flipBookRef}
                width={500}
                height={700}
                size="fixed"
                minWidth={400}
                maxWidth={1000}
                minHeight={500}
                maxHeight={1000}
                maxShadowOpacity={0.4}
                showCover={false}
                mobileScrollSupport={true}
                className="book"
                style={{ margin: "0 auto" }}
                startPage={0}
                drawShadow={true}
                flippingTime={800}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                onFlip={onPageFlip}
              >
                {/* Article Pages */}
                {articles.map((article, index) => (
                  <Page key={`${article.id}-${index}`}>
                    <div className="page-content article-page">
                      {/* Article Image */}
                      <div className="article-image-container">
                        <img
                          src={sampleImages[index % sampleImages.length]}
                          alt={`Article ${index + 1}`}
                          className="article-image"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className = "article-image-fallback";
                            fallback.textContent = "Article Image";
                            target.parentNode?.insertBefore(fallback, target);
                          }}
                        />
                      </div>

                      {/* Article Content */}
                      <div className="article-content-section">
                        <h2 className="article-title">{article.title}</h2>
                        <div className="article-body">
                          {formatArticleText(article.content)}
                        </div>
                      </div>

                      {/* Page Footer */}
                      <div className="page-footer">
                        <div className="footer-separator"></div>
                        <div className="footer-content">
                          <span className="creation-date">
                            {new Date(article.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Page>
                ))}
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
                Previous spread
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
                disabled={currentPage >= totalPages - 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Next spread
                <span>→</span>
              </button>
            </div>

            {/* Usage Instructions */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Two-page spread • Click pages or use navigation • Drag to flip on
              mobile
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
