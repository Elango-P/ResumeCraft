# ResumeCraft

ResumeCraft is a local-first resume builder. Create, edit, preview, and download ATS-friendly A4 resumes without an account.

## Run the project

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm start
```

## Optional environment variables

This build stores drafts in the browser only. No env file is required.

If you add Supabase auth later, use:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not store authentication tokens in `localStorage` yourself. Use the Supabase client session handling.

## How drafts are saved

Resume drafts persist under the versioned key `resumecraft:v1`. You can create multiple drafts, autosave is debounced, and PDF export uses the browser print dialog with A4 page styles.
