# AgriAssist Pro

**Smarter Farming, Sustainable Future.**

AgriAssist Pro is a modern, AI-powered web application designed to be a smart farming companion. It provides farmers with data-driven insights to optimize their operations, increase productivity, and promote sustainability. The application leverages Google's Gemini AI for advanced analytics and Supabase for backend services.

## Features

- **AI Agricultural Assistant**: An interactive chat interface where farmers can ask questions about crop management, soil health, and other agricultural topics.
- **Crop Disease Detection**: Upload an image of a plant leaf to get an AI-powered analysis of potential diseases, including confidence scores, descriptions, and treatment plans.
- **Yield Prediction**: Forecast crop yields with high accuracy using a predictive model that considers crop type, farm size, location, and soil type.
- **Smart Watering System**: Monitor simulated soil moisture levels and receive intelligent watering recommendations based on crop type and user-defined thresholds.
- **Market Advisor**: Get AI-powered market analysis and price forecasts for various crops, grounded with real-time Google Search data.
- **Multi-Language Support**: The user interface is available in multiple languages, including English and several Indian languages, to cater to a diverse user base.
- **User Profile Management**: Users can manage their farm details, which personalizes the advice and predictions provided by the tools.
- **Responsive Design**: A clean, modern, and fully responsive interface that works on both desktop and mobile devices.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A web browser

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vigneshworkspace/agri.git
    cd agri
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project directory. This file will store your API keys and other secrets.
    ```bash
    touch .env
    ```

    Open the `.env` file and add the following variables, replacing the placeholder values with your actual credentials:

    ```env
    # Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # Get your keys from the Supabase project settings
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # Get your keys from your Clerk dashboard
    VITE_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
    ```

    **Note**: If you do not provide a `VITE_GEMINI_API_KEY`, the application will run using mock data for all AI-powered features.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5173` (or the next available port).

## Usage

Once the application is running, you can explore its features:

-   **Landing Page**: The initial page you see, which provides an overview of the application.
-   **Authentication**: Click "Get Started" or "Start Your Free Trial" to sign up or log in using the Clerk-powered authentication flow.
-   **Tools Dashboard**: After logging in, you will be directed to the main tools dashboard.
    -   **Navigation**: Use the sidebar (on desktop) or the bottom navigation bar (on mobile) to switch between different tools like the AI Assistant, Disease Detection, etc.
    -   **Profile**: Navigate to the "Profile" page to enter your farm details. This information is used to tailor the AI's recommendations.
    -   **AI Assistant**: Type a question in the chat box or use a suggestion chip to start a conversation with the AI.
    -   **Disease Detection**: Upload a clear photo of a plant leaf to receive a diagnosis.
    -   **Yield Prediction**: Select a crop and ensure your profile is complete to get a yield forecast.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized static assets. You can preview the production build locally with:

```bash
npm run preview
```

## Deployment

This project is configured for easy deployment to [Vercel](https://vercel.com/).

-   **Automatic Deploys**: The recommended workflow is to connect your GitHub repository to a Vercel project. Vercel will automatically build and deploy new versions whenever you push to the `main` branch.
-   **Manual Deploys**: You can also deploy from your local machine using the Vercel CLI:
    ```bash
    # Install Vercel CLI if you haven't already
    npm install -g vercel

    # Deploy to production
    vercel --prod
    ```
