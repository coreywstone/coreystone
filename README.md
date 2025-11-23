# Corey Stone Portfolio

Modern React-based portfolio site with comic book aesthetic, built with Vite and deployed on Vercel.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Modern CSS** - Custom comic book theme with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
coreystone/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── IntroSection.jsx
│   │   ├── ProjectRow.jsx
│   │   ├── ProjectFrame.jsx
│   │   ├── QuotesRow.jsx
│   │   └── QuoteBox.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Bio.jsx
│   │   └── ProjectPage.jsx
│   ├── styles/           # Global styles
│   │   └── main.css
│   ├── App.jsx           # Main app component with routing
│   └── main.jsx          # React entry point
├── public/                # Static assets
│   ├── img/              # Images
│   └── animations/       # Rive animation files
├── dist/                 # Build output (gitignored)
├── package.json
├── vite.config.js
└── vercel.json           # Vercel deployment config
```

## Design System

### Colors
- **Blackish**: `#262629` (text and dark backgrounds)
- **Marble**: `#CED4E0` (some backgrounds)
- **White-ish/Cream**: `#F5EFE7` (talk bubbles and reverse text)
- **Blue**: `#8199E9` (links and buttons)
- **Charcoal**: `#48526B` (dim text, pants)
- **Slate Blue**: `#4A6B7C` (pants, hover)
- **Beige**: `#D4B5A0` (occasional fills)
- **Coral**: `#E07856` (accents)
- **Golden Flash**: `#FFC654` (highlights)
- **Green**: `#49C478` (vegetation)

### Typography
- **Headers**: Bangers (Google Font)
- **Body**: Anime Ace (CDN Fonts)

### Border Radius
- All elements use `2px` border radius for the comic book aesthetic

## Deployment

This site is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deployments happen automatically on push to main branch

The `vercel.json` file configures the build settings.

## Manual Editing

For simple content updates:

1. Edit the React components in `src/pages/` or `src/components/`
2. For project frames and quotes, update the data arrays in the respective components
3. Run `npm run build` to test locally
4. Push changes to trigger automatic deployment

## Future Enhancements

- Content management system for project slides and quotes
- Migration of all project pages from HTML to React
- Integration of Rive animations in IntroSection
