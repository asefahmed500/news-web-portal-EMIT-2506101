This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses:

- Next.js app (frontend) on `http://localhost:3001`
- JSON-Server (mock backend) on `http://localhost:3000`

### 1) Install

```powershell
npm install
```

### 2) Configure Environment

```powershell
copy .env.example .env.local
```

Edit `.env.local` if needed (defaults to `http://localhost:3000` for API).

### 3) Run JSON-Server (API)

```powershell
npm run api
```

### 4) Run Next.js (Frontend)

```powershell
npm run dev
```

Open `http://localhost:3001`.

App pages:

- `http://localhost:3001/login`
- `http://localhost:3001/news`

Notes:

- Login is simulated using localStorage.
- Only the author can edit/delete their own news.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
