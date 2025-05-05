# Datakat Frontend

Datakat is a modern observability and AI platform built with Next.js, React, and TypeScript. This frontend application provides a user-friendly interface for monitoring and analyzing application metrics, with powerful visualization capabilities and AI-driven insights.

## Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript
- **State Management**: Redux Toolkit with Redux Persist for robust state management
- **UI Components**: Ant Design (antd) for consistent and professional UI elements
- **Data Visualization**:
  - Ant Design Plots for advanced charts
  - Recharts for interactive data visualization
- **AI Integration**: Google's Generative AI for intelligent insights
- **Styling**: Tailwind CSS with custom configurations
- **Development Tools**: ESLint, Prettier, and TypeScript for code quality

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Datakat-Frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:

```env
# Add your environment variables here
```

## Development

To start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm analyze` - Analyze bundle size

## Project Structure

```
src/
├── app/              # Next.js app directory (routing)
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── store/           # Redux store configuration
└── types/           # TypeScript type definitions
```

## UI Components

The application uses Ant Design components along with custom components:

- Metrics visualization components
- Dashboard cards and widgets
- Data tables and filters
- Custom charts and graphs

## State Management

The application uses Redux Toolkit for state management with the following features:

- Centralized store configuration
- Redux Persist for state persistence
- Type-safe actions and reducers
- Efficient data handling for metrics and analytics

## Code Style

The project follows strict code style guidelines:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling
