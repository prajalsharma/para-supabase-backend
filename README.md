

1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Environment Variables](#environment-variables)
4. [Available Scripts](#available-scripts)
5. [Learn More](#learn-more)
6. [Deployment](#deployment)

---

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prajalsharma/para-supabase-backend.git

2. Navigate into the project directory:
    ```bash
    cd your-repo
    ```

3. Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

4. Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```

Your application should now be running on [http://localhost:3000](http://localhost:3000).

### Environment Variables

Before running the application, you need to set up the following environment variables in your `.env` file:

```plaintext
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
PARA_API_KEY=<your_para_api_key>
SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
PORT=<your_port>
```

Make sure to replace the placeholders with your actual values.
