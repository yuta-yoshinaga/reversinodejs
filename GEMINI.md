# GEMINI.md

This file provides guidance to GEMINI when working with code in this repository.

## Commonly Used Commands

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Run the development server:**
  ```bash
  npm run dev
  ```

- **Run tests:**
  ```bash
  npm run test
  ```

- **Run a single test file:**
  ```bash
  npm run test -- <path/to/your.test.tsx>
  ```

- **Lint the code:**
  ```bash
  npm run lint
  ```

- **Build for production:**
  ```bash
  npm run build
  ```

## Code Architecture and Structure

This is a standard Vite-based React application using TypeScript and Tailwind CSS.

- **Build Tool:** Vite is used for the development server and build process. Configuration is in `vite.config.ts`.
- **Framework:** React with TypeScript. The application entry point is `src/main.tsx`, which renders the root `<App />` component.
- **Routing:** `react-router-dom` handles client-side routing. Routes are defined in `src/App.tsx`.
- **Styling:** Tailwind CSS is used for styling. The main CSS file with Tailwind directives is `src/index.css`.
- **Component Organization:**
  - `src/pages/`: Contains top-level components for each page/route (e.g., `Home.tsx`, `About.tsx`).
  - `src/components/`: Contains reusable components shared across pages (e.g., `Navbar.tsx`).
- **Testing:** Vitest and React Testing Library are used for testing. The test environment is configured in `vite.config.ts` to use `jsdom`. Test files use the `.test.tsx` suffix (e.g., `App.test.tsx`).