# Toolbox - Web Toolkit

A collection of free, simple, and beautifully designed web utilities for everyday tasks, built with a modern tech stack.

**[Live Demo](https://ducklin.de/projects/toolbox/)**

> **Note:** This project is currently a work in progress and serves as a tech demo to showcase a modern web development stack. While the existing tools are functional, expect ongoing changes and the addition of new features over time.

---

## Features

- **QR Code Generator**: Create and customize QR codes with options for text/URL, colors, error correction levels, and even embedding your own logo.
- **Interactive & Animated UI**: Smooth page transitions, interactive backgrounds powered by Three.js, and delightful micro-interactions create a polished user experience.
- **Modern Design**: A sleek, dark-themed interface built with Tailwind CSS v4 and custom UI components.
- **More Tools Coming Soon**: The project is structured to easily accommodate new tools like a JSON formatter, color converter, and more.
- **Responsive**: Designed to work seamlessly across desktop and mobile devices.

## Tech Stack

This project is built with a focus on modern web technologies and best practices.

- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Routing**: [React Router](https://reactrouter.com/)
- **Animation**:
  - [Motion](https://motion.dev/) (from Framer Motion) for UI animations.
  - [GSAP](https://gsap.com/) for complex timeline-based animations.
- **3D / WebGL**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei), and [postprocessing](https://github.com/pmndrs/postprocessing) for interactive backgrounds.
- **UI Primitives**: Built on top of [Radix UI](https://www.radix-ui.com/) for accessibility and functionality.
- **Linting**: [ESLint](https://eslint.org/) and [TypeScript ESLint](https://typescript-eslint.io/) for code quality.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/SoldatenEnte/toolbox.git
    cd toolbox
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

To create a production-ready build of the application:

```sh
npm run build
```

This will generate a `dist` directory with optimized static assets that you can deploy to any hosting service.

## Project Structure

The project is organized to be modular and scalable:

```
toolbox/
├── src/
│   ├── components/
│   │   ├── bits/       # Small, unique, often animated components (e.g., Beams, FuzzyText)
│   │   └── ui/         # Reusable UI components (Button, Card, etc.)
│   ├── pages/
│   │   ├── tools/      # Components for each individual tool
│   │   └── HomePage.tsx # The main landing page
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── tools.ts        # Central configuration for all available tools
├── public/             # Static assets
└── ...                 # Config files (Vite, PostCSS, ESLint, etc.)
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
