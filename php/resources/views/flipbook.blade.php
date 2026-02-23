<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">


        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background-color: #ffffff; color: #000000; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
            main { max-width: 112rem; margin: 0 auto; padding: 1.5rem; }
            .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
            h1 { font-size: 1.875rem; font-weight: 600; color: #000; margin-bottom: 1rem; }
            .add-btn { background-color: #000; color: white; padding: 0.5rem 1.5rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: background-color 0.2s; }
            .add-btn:hover { background-color: #262626; }
            .status { margin-bottom: 1rem; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 0.875rem; border-radius: 0.375rem; padding: 0.75rem; }
            .empty-state { text-align: center; padding: 4rem 0; }
            .empty-state h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
            .empty-state p { color: #6b7280; margin-bottom: 1.5rem; }
            .book-container { display: flex; flex-direction: column; align-items: center; }
            .flipbook-wrapper { margin: 2rem 0; }
            #flipbook { margin: 0 auto; }
            .page { 
                background-color: #fff; 
                height: 100%; 
                display: flex; 
                flex-direction: column; 
                position: relative;
                overflow: hidden;
            }
            .page-content { 
                height: 100%; 
                display: flex; 
                flex-direction: column; 
            }
            .article-image-container { 
                width: 100%; 
                height: 200px; 
                overflow: hidden; 
                background-color: #f3f4f6;
                flex-shrink: 0;
            }
            .article-image { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
            }
            .article-image-fallback {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #e5e7eb;
                color: #6b7280;
                font-size: 0.875rem;
            }
            .article-content-section { 
                padding: 1.5rem; 
                flex: 1; 
                overflow: hidden;
            }
            .article-title { 
                font-size: 1.25rem; 
                font-weight: 600; 
                margin-bottom: 1rem; 
                line-height: 1.3;
            }
            .article-body { 
                font-size: 0.875rem; 
                line-height: 1.6; 
                color: #374151;
            }
            .article-paragraph { 
                margin-bottom: 0.75rem; 
            }
            .page-footer { 
                padding: 1rem 1.5rem; 
                border-top: 1px solid #e5e7eb;
                flex-shrink: 0;
            }
            .footer-content { 
                text-align: center; 
            }
            .creation-date { 
                font-size: 0.75rem; 
                color: #6b7280; 
            }
            .controls { 
                display: flex; 
                align-items: center; 
                gap: 1rem; 
                margin-top: 2rem; 
            }
            .nav-btn { 
                background-color: #2563eb; 
                color: white; 
                padding: 0.5rem 1.5rem; 
                border-radius: 0.5rem; 
                font-size: 0.875rem; 
                font-weight: 500; 
                border: none; 
                cursor: pointer; 
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: background-color 0.2s;
            }
            .nav-btn:hover:not(:disabled) { background-color: #1d4ed8; }
            .nav-btn:disabled { 
                background-color: #d1d5db; 
                cursor: not-allowed; 
            }
            .page-counter { 
                background-color: white; 
                border: 1px solid #d1d5db; 
                padding: 0.5rem 1rem; 
                border-radius: 0.5rem; 
                font-weight: 500; 
                color: #374151;
            }
            .usage-hint {
                text-align: center;
                margin-top: 1rem;
                font-size: 0.875rem;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <main>
            <div class="header">
                <div>
                    <h1>Flipbook Page</h1>
                </div>
                <a href="{{ route('generator.index') }}" class="add-btn">Add Page</a>
            </div>

            @if (session('status'))
                <div class="status">
                    {{ session('status') }}
                </div>
            @endif

            @if (count($articles) === 0)
                <div class="empty-state">
                    <h2>No Articles Yet</h2>
                    <p>Create your first article to start building your flipbook</p>
                </div>
            @else
                <div class="book-container">
                    <div class="flipbook-wrapper">
                        <div id="flipbook">
                            @php
                                $sampleImages = [
                                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
                                    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&h=200&fit=crop',
                                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop',
                                    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop',
                                ];
                            @endphp

                            @foreach ($articles as $index => $article)
                                <div class="page">
                                    <div class="page-content article-page">
                                        <!-- Article Image -->
                                        <div class="article-image-container">
                                            <img 
                                                src="{{ $article['image_url'] ?? $sampleImages[$index % count($sampleImages)] }}" 
                                                alt="{{ $article['title'] ?? 'Article ' . ($index + 1) }}"
                                                class="article-image"
                                                onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\'article-image-fallback\'>Article Image</div>';"
                                            />
                                        </div>

                                        <!-- Article Content -->
                                        <div class="article-content-section">
                                            <h2 class="article-title">{{ $article['title'] ?? 'Untitled Project' }}</h2>
                                            <div class="article-body">
                                                @php
                                                    $content = $article['content'] ?? '';
                                                    $paragraphs = array_filter(explode("\n\n", $content));
                                                    $displayParagraphs = array_slice($paragraphs, 0, 3);
                                                @endphp
                                                @foreach ($displayParagraphs as $paragraph)
                                                    <p class="article-paragraph">{{ trim($paragraph) }}</p>
                                                @endforeach
                                            </div>
                                        </div>

                                        <!-- Page Footer -->
                                        <div class="page-footer">
                                            <div class="footer-content">
                                                <span class="creation-date">
                                                    {{ \Carbon\Carbon::parse($article['created_at'])->format('F j, Y') }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <!-- Enhanced Navigation Controls -->
                    <div class="controls">
                        <button id="prevBtn" class="nav-btn" disabled>
                            <span>←</span>
                            Previous spread
                        </button>

                        <div class="page-counter">
                            <span style="font-weight: 700;"><span id="currentSpread">1</span></span>
                            of
                            <span style="font-weight: 700;"><span id="totalSpreads">{{ ceil(count($articles) / 2) }}</span></span>
                        </div>

                        <button id="nextBtn" class="nav-btn">
                            Next spread
                            <span>→</span>
                        </button>
                    </div>

                    <!-- Usage Instructions -->
                    <div class="usage-hint">
                        Two-page spread • Click pages or use navigation • Drag to flip on mobile
                    </div>
                </div>
            @endif
        </main>

        @if (count($articles) > 0)
            <script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js"></script>
            <script>
                const pageFlip = new St.PageFlip(document.getElementById('flipbook'), {
                    width: 500,
                    height: 700,
                    size: 'fixed',
                    minWidth: 400,
                    maxWidth: 1000,
                    minHeight: 500,
                    maxHeight: 1000,
                    maxShadowOpacity: 0.4,
                    showCover: false,
                    mobileScrollSupport: true,
                    drawShadow: true,
                    flippingTime: 800,
                    usePortrait: false,
                    startZIndex: 0,
                    autoSize: false,
                    clickEventForward: true,
                    useMouseEvents: true,
                    swipeDistance: 30,
                    showPageCorners: true,
                    disableFlipByClick: false,
                    startPage: 0
                });

                pageFlip.loadFromHTML(document.querySelectorAll('.page'));

                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                const currentSpreadSpan = document.getElementById('currentSpread');
                const totalPages = {{ count($articles) }};

                let currentPage = 0;

                pageFlip.on('flip', function(e) {
                    currentPage = e.data;
                    const spreadNumber = Math.floor(currentPage / 2) + 1;
                    currentSpreadSpan.textContent = spreadNumber;
                    
                    prevBtn.disabled = currentPage === 0;
                    nextBtn.disabled = currentPage >= totalPages - 1;
                });

                prevBtn.addEventListener('click', function() {
                    pageFlip.flipPrev();
                });

                nextBtn.addEventListener('click', function() {
                    pageFlip.flipNext();
                });
            </script>
        @endif
    </body>
</html>
