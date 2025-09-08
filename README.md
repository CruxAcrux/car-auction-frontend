# Car Auction Frontend

A frontend application for a car auction platform built with React and TypeScript. Users can browse vehicle listings, place bids, and manage their own advertisements. This is the frontend component that works with a separate backend API.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-blue)

![Chat Preview](https://imgur.com/KIlHMBb.png)
![Chat Preview](https://imgur.com/oCHZ7eT.png)

## Features
- **Responsive UI**: Clean, modern design with mobile-friendly navigation
- **Car Ad Management**: Create, edit, and delete car ads with image uploads
- **Bidding System**: Place bids on auction-style listings
- **Fixed-Price Purchases**: Buy cars instantly at fixed prices
- **Search and Filtering**: Advanced filtering by brand, model, price, and features
- **User Authentication**: Secure login and registration
- **Image Galleries**: Interactive carousels for viewing vehicle images

## Technologies Used
- **React 18.3.1** - Component-based UI library
- **TypeScript 5.4** - Type-safe JavaScript development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router 6.22.3** - Client-side routing
- **React Query 5.29.2** - Server state management
- **React Hook Form 7.51.1** - Form handling with validation
- **Axios 1.6.8** - HTTP client for API requests
- **React Toastify 10.0.5** - Notification system
- **Framer Motion 11.0.20** - Animation library
- **React Icons 5.0.1** - Icon library

## Prerequisites
To run the Car Auction frontend, ensure you have the following installed:

### Software and Tools
- **Node.js**:
  - Version: 18.x or later
  - Install: [nodejs.org](https://nodejs.org/en/download/)
  - Verify:
    ```bash
    node --version
    ```

- **npm**:
  - Version: 9.x or later
  - Verify:
    ```bash
    npm --version
    ```

- **Backend API**:
  - The frontend requires a running Car Auction backend API at `http://localhost:5064`
  - See the [Car Auction API repository](https://github.com/CruxAcrux/car-auction-api) for backend setup

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/CruxAcrux/car-auction-frontend.git
   cd car-auction-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   - Installs React, TypeScript, Tailwind CSS, and other dependencies listed in `package.json`

3. **Environment Configuration**:
   Create a `.env` file in the project root:
   ```env
   VITE_API_URL=http://localhost:5064
   ```
   - Replace with your backend API URL if different

## Running the Frontend

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   - Runs the app at `http://localhost:5173`

2. **Access the Application**:
   Open `http://localhost:5173` in your browser

3. **Build for Production**:
   ```bash
   npm run build
   ```
   - Creates optimized production build in `dist` folder

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── CarAdCard.tsx   # Car ad preview card
│   └── ImageCarousel.tsx # Image gallery component
├── pages/              # Page components
│   ├── Home.tsx        # Landing page with car listings
│   ├── CarAdDetail.tsx # Individual car ad page
│   ├── CreateAd.tsx    # Create new ad form
│   ├── EditAd.tsx      # Edit existing ad form
│   ├── MyListings.tsx  # User's own listings
│   ├── Login.tsx       # Authentication page
│   └── Register.tsx    # User registration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── services/           # API service functions
```

## Key Components

### Navigation
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Site links and information

### Car Ad Components
- **CarAdCard**: Displays car preview with image, price, and basic info
- **ImageCarousel**: Interactive image gallery with thumbnails
- **BidForm**: Form for placing bids on auction listings

### Pages
- **Home**: Main landing page with search and car listings
- **CarAdDetail**: Detailed view of individual car ads
- **CreateAd/EditAd**: Forms for managing car listings
- **MyListings**: User's personal car advertisements

## API Integration
The frontend communicates with the backend API using Axios. Key endpoints include:

- **Authentication**: `/api/Account/register`, `/api/Account/login`
- **Car Ads**: `/api/CarAd`, `/api/CarAd/search`, `/api/CarAd/{id}`
- **Bidding**: `/api/Bid`, `/api/Bid/carAd/{carAdId}`
- **Brands/Models**: `/api/CarAd/brands`

## Configuration
Update `src/services/api.ts` with your backend configuration:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5064';
```

## Deployment

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the deployment prompts

## Known Issues
- **Image Upload**: Large images may require compression before upload
- **Bid Validation**: Ensure backend is running for real-time bid validation
- **Mobile Safari**: Some animations may behave differently on iOS devices

