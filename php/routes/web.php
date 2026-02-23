<?php

use App\Http\Controllers\ArticleGeneratorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ArticleGeneratorController::class, 'index'])->name('generator.index');
Route::post('/generate', [ArticleGeneratorController::class, 'generate'])->name('generator.generate');
