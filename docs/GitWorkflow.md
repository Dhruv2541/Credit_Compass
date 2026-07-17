# Title: Git Workflow & Collaboration Guide - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Development guidelines for branch structures, commit messages, PR reviews, merge strategies, and conflict resolutions.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: None
* **Related Documents**: [CodingStandards.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/CodingStandards.md), [TeamResponsibilities.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/TeamResponsibilities.md)

---

## Table of Contents
1. [Branching Strategy (Git Flow Light)](#branching-strategy-git-flow-light)
2. [Commit Message Standards (Semantic Commits)](#commit-message-standards-semantic-commits)
3. [Pull Requests & Code Reviews](#pull-requests--code-reviews)
4. [Merge Strategy](#merge-strategy)
5. [Conflict Resolution Guide](#conflict-resolution-guide)
6. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## Branching Strategy (Git Flow Light)
To keep branching simple during the 72-hour hackathon, we use two main branches:
- **`main`**: Production-ready code. Any code merged here must compile and deploy immediately.
- **`dev`**: Integration branch. Developers merge their features here first to test integrations before going to production.

```
          ┌─ feat/auth ───> Merge to dev
          │
main <── dev <─── feat/shap ───> Merge to dev
          │
          └─ feat/charts ─> Merge to dev
```

### Feature Branch Naming Rules
Name feature branches using the format `feature/<scope>-<short-description>`:
- `feature/auth-jwt-signup`
- `feature/ml-model-training`
- `feature/ui-dashboard-charts`

---

## Commit Message Standards (Semantic Commits)
Write semantic commit messages to keep our Git history clear and understandable:

`type(scope): brief explanation of what changed`

### Common Commit Types
- `feat`: Code changes implementing new features.
- `fix`: Code changes resolving active bugs.
- `docs`: Documentation updates.
- `refactor`: Structural updates that do not change external logic.
- `style`: Changes that do not affect the meaning of the code (formatting, white-space, etc.).

### Commit Examples
- `feat(ml): add logistic classifier training pipeline`
- `fix(auth): resolve JWT expiration token validation bug`
- `docs(api): update input payload schemas for alternative signals`

---

## Pull Requests & Code Reviews
- **Creating PRs**: Open all PRs targeting the `dev` branch.
- **Title format**: Align titles with semantic commits (e.g., `feat(ui): add dashboard gauges`).
- **PR Checklists**:
  - The code must compile without errors.
  - Pydantic models must validate request payloads.
  - Review and resolve any active linter issues.
- **Reviews**: PRs require at least one approval from another team member before merging.

---

## Merge Strategy
- **`dev` to `main` Merges**: Use squash merges when moving code to the main branch. This combines feature commits into a single commit to keep the history clean.
- **`feature` to `dev` Merges**: Use standard merges with merge commits to keep track of when features were added during development.

---

## Conflict Resolution Guide
When merge conflicts occur:

1. Pull the latest code from the target branch into your local branch:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout feature/your-branch
   git merge dev
   ```
2. Open conflict files in your editor, search for conflict markers (`<<<<<<<`), and resolve the differences.
3. Verify that the application still compiles and runs correctly after resolving conflicts.
4. Add the resolved files, commit the changes, and push them to your remote branch:
   ```bash
   git add .
   git commit -m "merge: resolve conflicts with dev branch"
   git push origin feature/your-branch
   ```

---

## Implementation Notes & Assumptions
- **Branch Protection Rules**: We configure the `main` branch to require approved pull requests and passing builds before code can be merged. This protects the production environment.
- **Coordination**: Let other team members know before making changes to shared files (like `db/models.py`) to reduce the likelihood of merge conflicts.
