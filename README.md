Prerequisites

Node.js 18+ (recommended)

npm (or yarn/pnpm)


Clone the repo
git clone <your-repo-url>
cd <your-repo-folder>


Replace <your-repo-url> and <your-repo-folder> with your values.

Environment

Create a .env file in the project root and paste the provided values
Create a .env.local file in the project root and paste the provided values
Install dependencies
npm install

////////////////
Vercel Setup Local
1. Install Vercel CLI
npm i -g vercel

2. Login
vercel login with the provided account
3. Pull environment variables
vercel pull
4. Run locally using Vercel dev
vercel dev
Open localhost:3000
///////////////
Prisma setup (generate client & migrate)
1) Generate Prisma client

npx prisma generate

2) Create/migrate the database
3) Open Prisma Studio.Use Studio to inspect users, sessions, and stored hashes.
npx prisma studio
Open localhost:5555 

