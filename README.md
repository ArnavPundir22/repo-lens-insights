# RepoLens AI

> Understand any GitHub repository in seconds — with AI-powered summaries and beginner-friendly contribution suggestions.

## What is RepoLens AI?

RepoLens AI helps developers quickly understand open-source repositories. Paste a GitHub URL and get:

- **Repository summary** — A clear, plain-English explanation of what the project does
- **Beginner issues** — Curated suggestions for your first contribution

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/repolens-ai.git
cd repolens-ai

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

## Project Structure

```
repolens-ai/
├── src/
│   ├── components/       # UI components
│   │   ├── Header.tsx         # Navigation bar
│   │   ├── AnalyzeForm.tsx    # URL input form
│   │   ├── AnalysisResults.tsx # Results display
│   │   └── LoadingSkeleton.tsx # Loading placeholder
│   ├── lib/
│   │   └── analyze.ts    # AI analysis logic (mock)
│   ├── pages/
│   │   └── Index.tsx      # Main page
│   └── index.css          # Design system & styles
├── public/                # Static assets
├── CONTRIBUTING.md        # How to contribute
├── ROADMAP.md             # Future plans
└── README.md              # You are here
```

## Tech Stack

- **React** + **TypeScript** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Lucide Icons** — Icon set

## Contributing

We welcome contributors of all experience levels! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
