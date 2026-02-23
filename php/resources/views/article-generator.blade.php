<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Article Generator (PHP)</title>

        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif
    </head>
    <body class="bg-gray-50 text-gray-900 min-h-screen">
        <main class="max-w-5xl mx-auto px-6 py-8">
            <h1 class="text-3xl font-semibold mb-2">Input-Based Article Generator</h1>
            <p class="text-sm text-gray-600 mb-6">Laravel version (phase 1): generate response from form inputs.</p>

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
                    @else
                        <p class="text-sm text-gray-500">Your generated response will appear here.</p>
                    @endif
                </section>
            </div>
        </main>
    </body>
</html>
