<?php

namespace App\Services;

class InputArticleGenerator
{
    /**
     * @param array<string, string> $fields
     */
    public function generate(array $fields): string
    {
        $projectTitle = $fields['project_title'] ?: 'Community Project';
        $projectDate = $fields['project_date'] ?: 'recently';
        $club = $fields['club'] ?: 'our community organization';
        $projectCategory = $fields['project_category'] ?: 'Community';
        $areaOfFocus = $fields['area_of_focus'] ?: 'community development';

        return "{$projectTitle}\n\n"
            . "This initiative, organized by {$club} on {$projectDate}, represents a practical step forward in {$areaOfFocus}. "
            . "It highlights how focused planning and volunteer collaboration can create measurable local impact.\n\n"
            . "As a {$projectCategory} project, it brings together stakeholders around a shared outcome and ensures that effort is directed toward real needs. "
            . "The activity model is simple, repeatable, and suitable for future rollouts in nearby communities.\n\n"
            . "By centering {$areaOfFocus}, the project builds momentum for long-term participation and shows how structured community action can produce sustainable results. "
            . "This response is generated directly from your inputs and can be refined in the next phase with persistence and flipbook display.";
    }
}
