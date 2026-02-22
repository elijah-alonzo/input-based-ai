"use client";

import { useRef, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Article } from "@/lib/article-store";

interface FlipbookProps {
  articles: Article[];
}

interface PageProps {
  children: React.ReactNode;
  number?: number;
}

const Page = ({ children, number }: PageProps) => (
  <div className="bg-white shadow-lg border border-gray-200 p-8 h-full flex flex-col">
    {children}
    {number !== undefined && (
      <div className="text-center text-sm text-gray-400 mt-auto pt-4">
        Page {number}
      </div>
    )}
  </div>
);

export default function FlipbookComponent({ articles }: FlipbookProps) {
  const flipBookRef = useRef<any>(null);

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

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No articles to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <HTMLFlipBook
          ref={flipBookRef}
          width={400}
          height={600}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="flipbook shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover Page */}
          <Page number={1}>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📚</div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Article Collection
              </h1>
              <p className="text-gray-600">
                {articles.length} article{articles.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Flip to start reading
              </p>
            </div>
          </Page>

          {/* Article Pages */}
          {articles.map((article, index) => (
            <Page key={article.id} number={index + 2}>
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold text-black mb-4 border-b pb-2">
                  {article.title}
                </h2>
                <div className="flex-1 overflow-auto">
                  <div className="text-black leading-relaxed whitespace-pre-wrap text-justify">
                    {article.content}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-4 pt-2 border-t">
                  Created: {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Page>
          ))}

          {/* Back Cover */}
          <Page number={articles.length + 2}>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-black mb-2">The End</h2>
              <p className="text-gray-600 mb-4">Thank you for reading!</p>
              <p className="text-sm text-gray-600">
                Add more articles to expand your collection
              </p>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={prevPage}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-sm font-medium transition-colors duration-200"
        >
          ← Previous
        </button>
        <button
          onClick={nextPage}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-sm font-medium transition-colors duration-200"
        >
          Next →
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Use navigation buttons or click/drag to flip pages
      </div>
    </div>
  );
}
