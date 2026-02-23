<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Article Generator (PHP)</title>

        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background-color: #f9fafb; color: #111827; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
            main { max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem; }
            .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; gap: 1rem; }
            h1 { font-size: 1.875rem; font-weight: 600; }
            h2 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem; }
            .subtitle { font-size: 0.875rem; color: #4b5563; margin-bottom: 1.5rem; }
            .go-to-btn { display: inline-flex; align-items: center; background-color: #000; color: white; border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.875rem; text-decoration: none; }
            .go-to-btn:hover { background-color: #1f2937; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
            @media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } }
            .section { background-color: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.25rem; }
            .form-group { margin-bottom: 1rem; }
            label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
            input, select, textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; font-family: inherit; }
            input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; }
            .error { font-size: 0.875rem; color: #dc2626; }
            button { width: 100%; border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.875rem; cursor: pointer; font-weight: 500; }
            .btn-primary { background-color: #000; color: white; }
            .btn-primary:hover { background-color: #1f2937; }
            .btn-blue { background-color: #2563eb; color: white; }
            .btn-blue:hover { background-color: #1d4ed8; }
            .btn-green { background-color: #16a34a; color: white; }
            .btn-green:hover { background-color: #15803d; }
            .article-content { white-space: pre-wrap; line-height: 1.625; font-size: 0.875rem; color: #1f2937; }
            .actions { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
            .actions form { display: contents; }
            .actions button { display: block; }
            .empty { font-size: 0.875rem; color: #a3a3a3; }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-900 min-h-screen">
        <main class="max-w-5xl mx-auto px-6 py-8">
            <div class="flex items-center justify-between mb-2 gap-4">
                <h1 class="text-3xl font-semibold">Input-Based Article Generator</h1>
                <a href="{{ route('flipbook.index') }}" class="inline-flex items-center bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800">Go to Flipbook</a>
            </div>
            <p class="text-sm text-gray-600 mb-6">Laravel version (phase 2): generate and add articles to flipbook.</p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section class="bg-white border border-gray-200 rounded p-5">
                    <form method="POST" action="{{ route('generator.generate') }}" class="space-y-4">
                        @csrf

                        <div>
                            <label for="project_title" class="block text-sm font-medium mb-1">Project Title</label>
                            <input id="project_title" name="project_title" type="text" value="{{ old('project_title', $submittedFields['project_title'] ?? '') }}" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                        </div>

                        <div>
                            <label for="project_date" class="block text-sm font-medium mb-1">Project Date</label>
                            <input id="project_date" name="project_date" type="text" value="{{ old('project_date', $submittedFields['project_date'] ?? '') }}" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                        </div>

                        <div>
                            <label for="club" class="block text-sm font-medium mb-1">Club / Organization</label>
                            <input id="club" name="club" type="text" value="{{ old('club', $submittedFields['club'] ?? '') }}" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                        </div>

                        <div>
                            <label for="project_category" class="block text-sm font-medium mb-1">Project Category</label>
                            <select id="project_category" name="project_category" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                @php($category = old('project_category', $submittedFields['project_category'] ?? ''))
                                <option value="">Select category...</option>
                                <option value="Community" @selected($category === 'Community')>Community</option>
                                <option value="International" @selected($category === 'International')>International</option>
                                <option value="Vocational" @selected($category === 'Vocational')>Vocational</option>
                                <option value="Youth" @selected($category === 'Youth')>Youth</option>
                            </select>
                        </div>

                        <div>
                            <label for="area_of_focus" class="block text-sm font-medium mb-1">Area of Focus</label>
                            <select id="area_of_focus" name="area_of_focus" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                                @php($focus = old('area_of_focus', $submittedFields['area_of_focus'] ?? ''))
                                <option value="">Select area of focus...</option>
                                <option value="Basic Education and Literacy" @selected($focus === 'Basic Education and Literacy')>Basic Education and Literacy</option>
                                <option value="Environment" @selected($focus === 'Environment')>Environment</option>
                                <option value="Maternal and Child Health" @selected($focus === 'Maternal and Child Health')>Maternal and Child Health</option>
                                <option value="Peace Building and Conflict Prevention" @selected($focus === 'Peace Building and Conflict Prevention')>Peace Building and Conflict Prevention</option>
                            </select>
                        </div>

                        @if ($errors->any())
                            <div class="text-sm text-red-600">
                                {{ $errors->first('form') ?? $errors->first() }}
                            </div>
                        @endif

                        <button type="submit" class="w-full bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800">Generate Article</button>
                    </form>
                </section>

                <section class="bg-white border border-gray-200 rounded p-5">
                    <h2 class="text-lg font-semibold mb-3">Generated Article</h2>

                    @if (!empty($article))
                        <article class="whitespace-pre-wrap leading-relaxed text-sm text-gray-800">{{ $article }}</article>

                        <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <form method="POST" action="{{ route('generator.download') }}">
                                @csrf
                                <textarea name="generated_article" class="hidden">{{ $article }}</textarea>
                                <input type="hidden" name="project_title" value="{{ $submittedFields['project_title'] ?? '' }}">

                                <button type="submit" class="w-full bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700">
                                    Download PDF
                                </button>
                            </form>

                            <form method="POST" action="{{ route('flipbook.add') }}">
                                @csrf
                                <textarea name="generated_article" class="hidden">{{ $article }}</textarea>
                                <input type="hidden" name="project_title" value="{{ $submittedFields['project_title'] ?? '' }}">
                                <input type="hidden" name="project_date" value="{{ $submittedFields['project_date'] ?? '' }}">
                                <input type="hidden" name="club" value="{{ $submittedFields['club'] ?? '' }}">
                                <input type="hidden" name="project_category" value="{{ $submittedFields['project_category'] ?? '' }}">
                                <input type="hidden" name="area_of_focus" value="{{ $submittedFields['area_of_focus'] ?? '' }}">

                                <button type="submit" class="w-full bg-green-600 text-white rounded px-4 py-2 text-sm hover:bg-green-700">
                                    Add to Flipbook
                                </button>
                            </form>
                        </div>
                    @else
                        <p class="text-sm text-gray-500">Your generated response will appear here.</p>
                    @endif
                </section>
            </div>
        </main>
    </body>
</html>
