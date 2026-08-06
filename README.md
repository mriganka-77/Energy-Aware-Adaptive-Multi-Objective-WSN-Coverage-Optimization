# WSN Simulation Project

A web-based presentation for a Hybrid LEACH–PEGASIS Wireless Sensor Network simulation project.

## App Overview

The `web` directory contains a React + Vite frontend that explains the LEACH, PEGASIS, and Hybrid routing protocols, shows simulated results, and includes a downloadable CSV of residual energy values.

## Run Locally

1. Open a terminal in the repository root:
   ```bash
   cd /Users/mriganka/Downloads/WSN/web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Access the App

Once the development server is running, open this URL in your browser:

- http://localhost:5173/

## Notes

- The app uses Vite, React, and Tailwind CSS.
- If any resource fails to load, refresh the browser or restart the dev server.
- The `web/public` folder contains the static assets used by the app.

## Project Structure

- `web/src/App.tsx` - main React application
- `web/src/main.tsx` - app bootstrap file
- `web/public` - static assets and favicon
- `web/package.json` - frontend dependencies and scripts
