# ValtIq – Bank account management app

Web application for bank account management that allows users to create, edit, search, and delete bank accounts
and performs fund transfers between accounts. Built with Next.js 15, TypeScript, App Router, Server Components, and Redux. It supports international currency transfers, localization, and runs entirely without containerization or special dependencies.

## Features

- Built with Next.js 15 and TypeScript

- Uses App Router and Server Components

- Integrated Redux for state management

- Supports localization (English + French)

- Mock backend runs locally with the frontend

- Fully responsive and accessible UI with modern design

- Transfer between accounts with different currencies

- Prevents transfers when insufficient funds

- Covered with unit and end-to-end (E2E) tests

## Tech Stack

- Next.js 15

- TypeScript

- Redux Toolkit

- i18next

- Jest & React Testing Library (unit testing)

- Playwright (E2E testing)

- JSON Server (mock API)

## Running ValtIq Locally

Start the application:

```bash
npm install
npm run dev     # Start the frontend
npm run api     # Start the mock backend
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run tests:

```bash
npm run test         # Run unit tests
npx playwright test  # Run E2E tests with Playwright
```

## Localization

English (en) and French (fr)
