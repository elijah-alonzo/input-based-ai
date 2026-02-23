<?php

namespace App\Http\Controllers;

use App\Services\InputArticleGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;
use Illuminate\View\View;

class ArticleGeneratorController extends Controller
{
    public function index(): View
    {
        return view('article-generator');
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
}
