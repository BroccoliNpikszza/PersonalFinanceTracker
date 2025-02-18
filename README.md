# Personal Finance Tracker

A DBMS project for personal finance tracking. User will be able to add details on monthly income, expenses, investments and get detailed report on monthly or annually.

## Roles:
[TBD]


## Tasks:
### Website design:
- layout
- Content display including graphs, charts, etc.
### Backend:
- Nodejs implementation with vite/ react or just bootstrap.
- DBMS implementation ; SQL/NOSQL (preferably Mongodb), defining schemas, database hosting and maintenance, 
- Report Generation: PDF generation on month end or/and graph and charts to display expenses and investments...



## Contributors
```
Eshan Kumar
Hrishab Neupane
Biplov Oli
```


## We will use shadcdn for components like graphs, charts, buttons, etc.

For installation:

```tsx
npm create vite@latest
cd "vite project"
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Editing files for specifying paths:

Starting with tailwind.config.js:

```tsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit tsconfig.json file:

```tsx
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

```

Edit tsconfig.app.json file

```tsx
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}

```

Update vite.config.ts

```tsx
npm install -D @types/node
```

then add:

```tsx
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

```

Install shadcn

```bash
npx shadcn@latest init
```
