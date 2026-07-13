# Git Workflow

## Overall Workflow

Issue → Branch → PR → CI → Review → Merge → Project auto-update

## Rules

- Avoid direct commits to `main` and `dev`
- Use standardized commit format (Conventional Commits)
- Atomic commits only (one fix per commit)
- Always pull before working to reduce conflicts
- Submit PR to merge `dev` into your branch

## Branch Naming

Format: `<type>/<description>`

**Types:**

- `main` — Production-ready code
- `dev/` — Development branch
- `feat/` — New features
- `bugfix/` or `fix/` — Bug fixes
- `refactor/` — Code refactoring (no feature change)
- `docs/` — Documentation
- `chore/` — Maintenance, dependencies, build config

**Rules:**

- Lowercase only
- Separate words with hyphens (not underscores)
- Be descriptive but concise
- Include issue number when applicable

**Examples:**

```markdown
feat/user-authentication
feat/add-dark-mode
bugfix/fix-login-bug
fix/issue-42-broken-form
refactor/optimize-database-queries
docs/setup-guide
chore/update-dependencies
```

## Commit Format

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```markdown
<type>[optional scope]: <subject>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code refactoring
- `docs` — Documentation
- `chore` — Maintenance, dependencies
- `ci` — CI/CD changes
- `test` — Tests

**Examples:**

```bash
feat(auth): add login endpoint

fix(dashboard): fix sidebar overlap on mobile

refactor(components): optimize button rendering

docs: update setup guide

chore: update dependencies
```

## Pull Request Process

### 1. Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feat/my-feature
```

### 2. Make Commits

Keep commits small and focused (one logical change per commit).

### 3. Update Branch with Latest `dev`

Before submitting PR:

```bash
git switch your-branch
git fetch origin
git merge origin/dev
```

Resolve conflicts if they occur, then commit and push.

### 4. Push and Submit PR

```bash
git push origin your-branch
```

Open PR on GitHub with:

- Clear title (use commit format)
- Description of changes
- Link related issue: `Fixes #123`

### 5. Address Review

Respond to feedback, make changes, push updates. CI checks must pass before merging.

### 6. Merge

Merge strategy: Squash and rebase. After merge, delete branch.

## Workflow Summary

| Step | Command |
|------|---------|
| Update dev locally | `git pull origin dev` |
| Create branch | `git checkout -b feat/name` |
| Before PR | `git fetch origin && git merge origin/dev` |
| Push | `git push origin feat/name` |
| Delete local | `git branch -d feat/name` |
| Delete remote | `git push origin --delete feat/name` |

## Merge Conflicts

When conflicts occur after `git merge origin/dev`:

1. Check conflicts: `git status`
2. Resolve files manually (look for `<<<<`, `====`, `>>>>` markers)
3. Stage resolved files: `git add .`
4. Commit: `git commit -m "fix: resolve merge conflicts"`
5. Push: `git push origin your-branch`

## Quick Troubleshooting

**Committed to wrong branch:**

```bash
git reset --soft HEAD~1
git stash
git checkout correct-branch
git stash pop
git commit
```

**Need to sync with latest dev:**

```bash
git fetch origin
git merge origin/dev
git push origin your-branch
```

**Want to undo last commit (before push):**

```bash
git reset --soft HEAD~1
```

## Issue Management

### Creating Issues

Use descriptive titles:

- ❌ "Bug"
- ✅ "LoginForm password validation fails with special characters"

Include:

- Description of problem/request
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub Docs: Merge Conflicts](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts)
