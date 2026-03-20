#!/usr/bin/env bash

set -e

MESSAGE="${1:-Update TripQuest website}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository."
  exit 1
fi

echo "Branch: $(git branch --show-current)"
echo "Message: $MESSAGE"
echo

git status --short
echo

git add .

if git diff --cached --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "$MESSAGE"
git push

echo
echo "Push complete."
