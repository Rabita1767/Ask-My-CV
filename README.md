# Ask My CV – Rabita Amin's Portfolio

A modern, interactive portfolio website powered by an AI chatbot that can answer questions about Rabita Amin’s professional background, skills, and experience directly from his CV.

## 🚀 Features

- **AI Chatbot**: Ollama-powered assistant that understands Rabita’s professional journey and responds contextually.
- **Dynamic CV Integration**: The chatbot reads content directly from `Rabita_Amin.md`.
- **Chat Persistence**: Conversation history is stored in `localStorage`, allowing users to resume previous sessions.
- **PDF Export**: Export chat conversations into a professionally formatted PDF for offline use.
- **Modern UI/UX**: Built with Next.js 15, Tailwind CSS 4, and Framer Motion for smooth animations and a polished experience.
- **Bento Grid Skills Section**: A visually engaging Bento grid layout to showcase categorized technical skills.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Rate Limiting**: Integrated safeguards to control API usage and enhance security.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI/LLM**: Ollama SDK (Gemma 3 4B Cloud)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)

## 📁 Project Structure

```text
├── src/
│   ├── app/            # Next.js App Router (pages & API routes)
│   ├── components/     # React components (Chatbot, Bento Grid, etc.)
│   ├── lib/            # Utility functions (Storage, Rate limiting, etc.)
│   └── globals.css     # Global styles and Tailwind imports
├── public/             # Static assets
└── Rabita_Amin.md # Source content for the AI
```

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Ollama Cloud API Key](https://ollama.com) (for the chatbot functionality)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Rabita1767/Ask-My-CV.git
   cd Ask-My-CV
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add your Ollama configuration:
   ```env
   OLLAMA_CLOUD_API_KEY=your_api_key_here
   OLLAMA_MODEL=gemma3:4b-cloud
   OLLAMA_BASE_URL=https://ollama.com
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Build

To create a production build:

```bash
npm run build
npm start
```

## 📄 License

This project is intended for personal portfolio use. All rights reserved. &copy; Rabita Amin.
