<?php

use App\Http\Controllers\ArticleGeneratorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ArticleGeneratorController::class, 'flipbook'])->name('home');
Route::get('/generator', [ArticleGeneratorController::class, 'index'])->name('generator.index');
Route::post('/generate', [ArticleGeneratorController::class, 'generate'])->name('generator.generate');
Route::post('/generate/download', [ArticleGeneratorController::class, 'downloadPdf'])->name('generator.download');
Route::post('/flipbook/add', [ArticleGeneratorController::class, 'addToFlipbook'])->name('flipbook.add');
Route::get('/flipbook', [ArticleGeneratorController::class, 'flipbook'])->name('flipbook.index');
