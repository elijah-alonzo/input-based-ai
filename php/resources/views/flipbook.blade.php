<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Flipbook (PHP)</title>

        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif
    </head>
    <body class="bg-gray-50 text-gray-900 min-h-screen">
        <main class="max-w-5xl mx-auto px-6 py-8">
            <div class="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-semibold">Flipbook</h1>
                    <p class="text-sm text-gray-600 mt-1">Browse saved articles and add new ones.</p>
                </div>
                <a href="{{ route('generator.index') }}" class="inline-flex items-center bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800">Add New Article</a>
            </div>

            @if (session('status'))
                <div class="mb-4 border border-green-200 bg-green-50 text-green-800 text-sm rounded px-3 py-2">
                    {{ session('status') }}
                </div>
            @endif

            @if (count($articles) === 0)
                <section class="bg-white border border-gray-200 rounded p-6 text-center">
                    <h2 class="text-xl font-semibold mb-2">No Articles Yet</h2>
                    <p class="text-sm text-gray-600">Create an article and add it to your flipbook.</p>
                </section>
            @else
                <section class="bg-white border border-gray-200 rounded p-6">
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="text-lg font-semibold">Article Pages</h2>
                        <div class="text-sm text-gray-600">
                            <span id="pageLabel">1</span> of {{ count($articles) }}
                        </div>
                    </div>

                    <div id="flipbookPages" class="relative min-h-[320px]">
                        @foreach ($articles as $index => $article)
                            <article class="flipbook-page {{ $index === 0 ? '' : 'hidden' }}" data-page-index="{{ $index }}">
                                <h3 class="text-2xl font-bold mb-3">{{ $article['title'] ?? 'Untitled Project' }}</h3>
                                <p class="text-sm text-gray-500 mb-4">
                                    {{ \Carbon\Carbon::parse($article['created_at'])->format('F j, Y') }}
                                </p>
                                <div class="whitespace-pre-wrap leading-relaxed text-sm text-gray-800">{{ $article['content'] ?? '' }}</div>
                            </article>
                        @endforeach
                    </div>

                    <div class="mt-6 flex items-center justify-between">
                        <button id="prevBtn" type="button" class="bg-blue-600 text-white rounded px-4 py-2 text-sm disabled:bg-gray-300" disabled>Previous</button>
                        <button id="nextBtn" type="button" class="bg-blue-600 text-white rounded px-4 py-2 text-sm">Next</button>
                    </div>
                </section>
            @endif
        </main>

        @if (count($articles) > 0)
            <script>
                (function () {
                    const pages = Array.from(document.querySelectorAll('.flipbook-page'));
                    const prevBtn = document.getElementById('prevBtn');
                    const nextBtn = document.getElementById('nextBtn');
                    const pageLabel = document.getElementById('pageLabel');
                    let currentIndex = 0;

                    function render() {
                        pages.forEach((page, index) => {
                            page.classList.toggle('hidden', index !== currentIndex);
                        });

                        pageLabel.textContent = String(currentIndex + 1);
                        prevBtn.disabled = currentIndex === 0;
                        nextBtn.disabled = currentIndex === pages.length - 1;
                    }

                    prevBtn.addEventListener('click', function () {
                        if (currentIndex > 0) {
                            currentIndex -= 1;
                            render();
                        }
                    });

                    nextBtn.addEventListener('click', function () {
                        if (currentIndex < pages.length - 1) {
                            currentIndex += 1;
                            render();
                        }
                    });

                    render();
                })();
            </script>
        @endif
    </body>
</html>
