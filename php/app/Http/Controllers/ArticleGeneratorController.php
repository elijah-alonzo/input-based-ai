<?php

namespace App\Http\Controllers;

use App\Services\FlipbookStore;
use App\Services\InputArticleGenerator;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Validator;
use Illuminate\View\View;

class ArticleGeneratorController extends Controller
{
    public function index(): View
    {
        return view('article-generator', [
            'article' => '',
            'submittedFields' => [],
        ]);
    }

    public function generate(Request $request, InputArticleGenerator $generator): View|RedirectResponse
    {
        $validator = \Validator::make($request->all(), [
            'project_title' => ['nullable', 'string', 'max:255'],
            'project_date' => ['nullable', 'string', 'max:255'],
            'club' => ['nullable', 'string', 'max:255'],
            'project_category' => ['nullable', 'string', 'max:255'],
            'area_of_focus' => ['nullable', 'string', 'max:255'],
        ]);

        $validator->after(function (Validator $validator) use ($request): void {
            $fields = [
                'project_title',
                'project_date',
                'club',
                'project_category',
                'area_of_focus',
            ];

            $hasAnyValue = collect($fields)->contains(function (string $field) use ($request): bool {
                return filled($request->input($field));
            });

            if (! $hasAnyValue) {
                $validator->errors()->add('form', 'Please fill in at least one field.');
            }
        });

        if ($validator->fails()) {
            return redirect()
                ->route('generator.index')
                ->withErrors($validator)
                ->withInput();
        }

        $fields = [
            'project_title' => trim((string) $request->input('project_title', '')),
            'project_date' => trim((string) $request->input('project_date', '')),
            'club' => trim((string) $request->input('club', '')),
            'project_category' => trim((string) $request->input('project_category', '')),
            'area_of_focus' => trim((string) $request->input('area_of_focus', '')),
        ];

        $article = $generator->generate($fields);

        return view('article-generator', [
            'article' => $article,
            'submittedFields' => $fields,
        ]);
    }

    public function addToFlipbook(Request $request, FlipbookStore $flipbookStore): RedirectResponse
    {
        $validated = $request->validate([
            'project_title' => ['nullable', 'string', 'max:255'],
            'project_date' => ['nullable', 'string', 'max:255'],
            'club' => ['nullable', 'string', 'max:255'],
            'project_category' => ['nullable', 'string', 'max:255'],
            'area_of_focus' => ['nullable', 'string', 'max:255'],
            'generated_article' => ['required', 'string'],
        ]);

        $fields = [
            'project_title' => trim((string) ($validated['project_title'] ?? '')),
            'project_date' => trim((string) ($validated['project_date'] ?? '')),
            'club' => trim((string) ($validated['club'] ?? '')),
            'project_category' => trim((string) ($validated['project_category'] ?? '')),
            'area_of_focus' => trim((string) ($validated['area_of_focus'] ?? '')),
        ];

        $flipbookStore->add(
            title: $fields['project_title'] ?: 'Untitled Project',
            content: (string) $validated['generated_article'],
            fields: $fields,
        );

        return redirect()
            ->route('flipbook.index')
            ->with('status', 'Article added to flipbook.');
    }

    public function flipbook(FlipbookStore $flipbookStore): View
    {
        $articles = $flipbookStore->all();

        return view('flipbook', [
            'articles' => $articles,
        ]);
    }

    public function downloadPdf(Request $request): Response
    {
        $validated = $request->validate([
            'project_title' => ['nullable', 'string', 'max:255'],
            'generated_article' => ['required', 'string'],
        ]);

        $projectTitle = trim((string) ($validated['project_title'] ?? ''));
        $article = (string) $validated['generated_article'];
        $displayTitle = $projectTitle !== '' ? $projectTitle : 'Untitled Project';
        $slug = Str::of($displayTitle)->slug('-')->value();
        $filename = 'article-'.($slug !== '' ? $slug : 'untitled').'.pdf';

        $pdf = Pdf::loadView('pdf.article', [
            'title' => $displayTitle,
            'content' => $article,
        ]);

        return $pdf->download($filename);
    }
}
