# Bree Take-Home Project

This application checks to see if the person of interest exists in a database of sanctioned persons based on specific criteria and returns "Hit" in the UI alongside the values that were hits or misses if the full name is detected and "Clear" without the hits or misses if the full name is not detected.

## Table of Contents

- [Setup](#Setup)
- [Development](#development)
- [Usage](#usage)
- [Deployment](#deployment)


### Prerequisites

- Node.js (v21.x or higher)
- npm (v10.x or higher) or Yarn

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nmalchy/bree-take-home-project.git
   cd bree-take-home-project

2. **Install dependencies**
    ```bash
    cd frontend
    npm install

    cd ../backend
    npm install

3. Check out the .env.example and create a .env file in /backend + /frontend populating with the relevant variables


### Development

1. **Develop locally**
After installing the dependencies as described in the set-up, run the following commands:
    ```bash
    cd /backend 
    npm run dev

    cd ../frontend
    npm run dev

Now go to the localhost URL and have fun!

To run tests use the command `npm run test` in both the /backend and /frontend directories; in the frontend it may not detect the test files so you need to press "a" in the terminal

### Usage
I was unfortunately unable to acquire a functional API key for this project so I had to mock response data instead so in order to use the app and test the functionality you will need to base your inputs on this hard-coded mock data:

    { fullName: 'Justin Trudeau', birthYear: '1971', country: 'Canada' },
    { fullName: 'Pierre Poilievre', birthYear: '1979', country: 'Canada' },
    { fullName: 'Donald Trump', birthYear: '1946', country: 'USA' },
    { fullName: 'Kamala Harris', birthYear: '1964', country: 'USA' },

1. Enter text inputs in form fields based on the data above and try random other politicians not specified.

2. Press "Submit" button and see what happens

### Deployment

In order to deploy you need to specify a few things depending on the hosting service you use, but typically these are what you care about:

Back-end application:

You need to run these commands in order:
    
    npm install 
    npm run build
    npm run start

Build output folder will be in `/backend/dist`

Front-end application:

    npm install
    npm build

Build output folder will be in `/frontend/build`
