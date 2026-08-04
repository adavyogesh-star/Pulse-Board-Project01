# Pulse Board Project

## Testing

- Run backend tests:

```bash
npm --prefix backend test
```

- Run the full CI-style check locally:

```bash
npm run ci
```

## Deployment

This project includes a GitHub Actions workflow at `.github/workflows/ci.yml`.

When code is pushed to `main` or a pull request is opened against `main`, the workflow will:

- install root, backend, and frontend dependencies
- run backend tests
- build the frontend

## Useful commands

- Start backend locally:

```bash
npm --prefix backend start
```

- Start frontend locally:

```bash
npm --prefix frontend run dev
```
