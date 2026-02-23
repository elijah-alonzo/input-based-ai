<?php

namespace App\Services;

use Illuminate\Support\Str;

class FlipbookStore
{
    private string $filePath;

    public function __construct()
    {
        $this->filePath = storage_path('app/flipbook-articles.json');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function all(): array
    {
        $payload = $this->readPayload();

        return $payload['articles'] ?? [];
    }

    /**
     * @param array<string, string> $fields
     */
    public function add(string $title, string $content, array $fields = []): void
    {
        $payload = $this->readPayload();
        $articles = $payload['articles'] ?? [];

        $articles[] = [
            'id' => (string) Str::uuid(),
            'title' => trim($title) !== '' ? trim($title) : 'Untitled Project',
            'content' => trim($content),
            'fields' => $fields,
            'created_at' => now()->toIso8601String(),
        ];

        $this->writePayload(['articles' => $articles]);
    }

    /**
     * @return array{articles: array<int, array<string, mixed>>}
     */
    private function readPayload(): array
    {
        if (! file_exists($this->filePath)) {
            return ['articles' => []];
        }

        $content = file_get_contents($this->filePath);

        if ($content === false || trim($content) === '') {
            return ['articles' => []];
        }

        $decoded = json_decode($content, true);

        if (! is_array($decoded) || ! isset($decoded['articles']) || ! is_array($decoded['articles'])) {
            return ['articles' => []];
        }

        return $decoded;
    }

    /**
     * @param array{articles: array<int, array<string, mixed>>} $payload
     */
    private function writePayload(array $payload): void
    {
        $directory = dirname($this->filePath);

        if (! is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        file_put_contents($this->filePath, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
