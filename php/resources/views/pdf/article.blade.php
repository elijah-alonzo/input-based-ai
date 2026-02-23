<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>{{ $title }}</title>
        <style>
            body {
                font-family: DejaVu Sans, Arial, sans-serif;
                color: #1f2937;
                font-size: 12px;
                line-height: 1.6;
                margin: 32px;
            }

            h1 {
                font-size: 24px;
                text-align: center;
                margin: 0 0 24px;
                color: #111827;
            }

            .content {
                white-space: pre-wrap;
            }
        </style>
    </head>
    <body>
        <h1>{{ $title }}</h1>
        <div class="content">{{ $content }}</div>
    </body>
</html>
