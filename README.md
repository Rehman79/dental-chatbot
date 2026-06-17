# Bright Smile Dental — GPT Website Chatbot (Demo)

A live, clickable, GPT-powered website chatbot. The business's knowledge lives
directly in the system prompt — no vector DB or RAG needed for a demo.
Upgradeable to RAG for large knowledge bases.

**Stack:** Next.js (App Router) · OpenAI `gpt-4o-mini` · deploy on Vercel.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then paste your real OpenAI key
npm run dev                         # open http://localhost:3000
```

You need an OpenAI account with ~$5 of credit and an API key from
https://platform.openai.com/api-keys. A full demo costs pennies.

## Deploy to Vercel (free public link)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → New Project → import the repo.
3. In **Settings → Environment Variables**, add `OPENAI_API_KEY` = your key.
4. Deploy. You'll get a public `https://...vercel.app` link for your portfolio.

## Customize for any niche

Edit one thing: the `SYSTEM_PROMPT` in `app/api/chat/route.ts`. Swap the FACTS
for a gym, law firm, SaaS FAQ, etc. The richer and more specific the facts, the
better the demo. Update the heading and greeting in `app/page.tsx` to match.

## Files

- `app/api/chat/route.ts` — backend; holds the knowledge base + calls OpenAI.
- `app/page.tsx` — the chat widget UI.
- `app/layout.tsx` — page shell + metadata.

## Notes

- The API route returns a friendly error (not a crash) if the key is missing or
  OpenAI fails, so the demo never shows a broken screen to a client.
- `.env.local` is gitignored — your key never gets committed.
