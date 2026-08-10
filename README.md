# 🏡 Real Estate Portal

A commercial-grade, full-stack **Real Estate Web Application** built with Node.js, Express, EJS, and MongoDB. It features a responsive UI with dark glassmorphism styling, property listings, multi-parameter filtering, interactive favorites persistence, property owner contact modals, and an admin dashboard.

---

## 📋 Project Requirements & Compliance Checklist

Below is the verification matrix showing how this project satisfies all specified requirements:

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Property Listings** | Grid layout on Homepage & Listings page (`/properties`), complete with image galleries, price badges, room specs, and locations. | ✅ **Complete** |
| **Filters** | Location text search, instant category pills (*Apartment, House, Villa, Commercial, Land*), price range min/max, and price/date sorting. | ✅ **Complete** |
| **Contact Owner** | Instant "Show/Copy Phone", "Send Message" modal dialog, and "Schedule Visit" date/time picker modal. | ✅ **Complete** |
| **Favourite Properties** | One-click heart toggle button on all property cards with real-time MongoDB database persistence and a dedicated `/favorites` view. | ✅ **Complete** |
| **Admin Panel** | Located at `/admin/dashboard` with platform statistics, listing search, new property creation modal (with multi-image upload), and property deletion. | ✅ **Complete** |

---

## 🚀 Beginner-Friendly Setup Guide (Zero Code Experience Required)

Follow these easy steps to get the project running on your computer.

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/).
2. Download and install the **LTS (Recommended)** version for Windows or Mac.
3. Follow the standard installation wizard (click Next -> Next -> Finish).

### Step 2: Ensure MongoDB is Installed & Running
1. Make sure **MongoDB Community Server** is installed on your computer, or have a local MongoDB service running on port `27017` (default address `mongodb://127.0.0.1:27017/realestate`).
2. Alternatively, you can use MongoDB Compass or start the MongoDB service from your system services.

### Step 3: Open Command Prompt / Terminal in the Project Folder
1. Open the project folder (`REalstate`) on your computer.
2. Open your terminal or command prompt inside this folder:
   - **Mac**: Right-click the folder -> *New Terminal at Folder*.
   - **Windows**: Open the folder, click on the top address bar, type `cmd`, and press **Enter**.

### Step 4: Install Dependencies
In the terminal window, type the following command and press **Enter**:
```bash
npm install
```
*Wait a few seconds for all required packages (Express, Mongoose, EJS, Bcrypt, Multer) to download.*

### Step 5: Seed Sample Data & Admin Account
To populate the database with realistic sample properties and create your default Admin user, run:
```bash
npm run seed
```
*or `node seeder.js`*
*Output message:* `✅ Indian Data Imported Successfully!`

### Step 6: Start the Server
Run the application by typing:
```bash
npm start
```
*You will see:*
```text
🚀 Server running on http://localhost:3000
✅ MongoDB Connected: 127.0.0.1
```

### Step 7: Open in Your Web Browser
Open your web browser (Chrome, Edge, Safari, or Firefox) and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🖱️ Step-by-Step User Walkthrough

### 1. Exploring Property Listings
1. Visit `http://localhost:3000`. You will see the **Hero Banner** and **Featured Properties** section.
2. Click **Properties** in the top navigation bar (or click *Explore All*) to open the full listing catalog (`/properties`).
3. Hover over any property card to see smooth glassmorphism hover animations.
4. Click on any property card to view its full details page (`/properties/:id`).

### 2. Using Search & Filters
1. Go to the **Properties** page.
2. **Category Filter Pills**: Click on *Apartment*, *House*, *Villa*, or *Commercial* at the top of the toolbar to instantly filter by type.
3. **Location Search**: Type a city name (e.g., `Mumbai`, `Bengaluru`, `Delhi`) in the search box and click the search button.
4. **Price Filter**: Enter a minimum price (e.g., `1000000`) and maximum price (e.g., `10000000`) to narrow down options.
5. **Sorting**: Use the dropdown to sort properties by *Price: Low to High* or *Price: High to Low*.
6. Click **Reset All Filters** anytime to clear all active filters.

### 3. Favouriting Properties
1. On any property card or property details page, click the **Heart Icon** (🤍).
2. If you are not logged in, the system will prompt you to login/register.
3. Once logged in, clicking the heart icon will instantly save the property to your account and turn the heart red (❤️).
4. Click **Favourites** in the navbar (or go to **Dashboard -> My Favourites**) to view all your saved properties.
5. Click the heart icon again to remove a property from your favorites list in real-time.

### 4. Contacting Property Owners
1. Click on any property to open its detail page.
2. On the right side, locate the **Verified Property Owner** card.
3. **Show / Copy Phone**: Click the button to view the owner's phone number and automatically copy it to your clipboard.
4. **Send Message**: Click *Send Message* to open a popup modal. Enter your inquiry message and click *Send Message*. A success toast notification will appear.
5. **Schedule Visit**: Click *Schedule Visit* to open a date and time slot picker modal. Select your preferred date and time, then click *Confirm Schedule*.

### 5. Using the Admin Panel & Adding Properties
1. Log in with the default Admin credentials:
   - **Email**: `admin@realstate.com`
   - **Password**: `admin123`
2. Click **Admin** in the top navigation bar to enter the **Admin Control Panel** (`/admin/dashboard`).
3. **View Statistics**: Check total listings, registered users, and platform revenue.
4. **Quick Table Filter**: Type any keyword in the admin search bar to quickly locate specific properties in the table.
5. **Add New Property**:
   - Click the blue **Add New Property** button.
   - Fill in the title, category, price, location, bedrooms, bathrooms, area, owner name, owner phone, and description.
   - (Optional) Select image files from your computer.
   - Click **Save Property Listing**. The new property will immediately appear on the site!
6. **Delete Property**: Click the red trash icon next to any property in the admin table to delete it.

---

## 🔑 Default User & Admin Credentials

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin User** | `admin@realstate.com` | `admin123` | Full Admin Access |
| **Regular User** | Register via `/register` | Custom | Regular User Access |

---

## 📁 Project Directory Structure

```text
REalstate/
├── config/
│   └── db.js                 # MongoDB database connection setup
├── controllers/
│   ├── authController.js     # User registration, login, logout logic
│   └── propertyController.js # Listings, search, filters, favorites, admin CRUD
├── middleware/
│   └── auth.js               # Route protection & role authorization middleware
├── models/
│   ├── Property.js           # Mongoose schema for property listings
│   └── User.js               # Mongoose schema for users & favorite property IDs
├── public/
│   ├── css/
│   │   ├── components.css    # UI buttons, cards, navbar, breadcrumbs, toasts
│   │   ├── layout.css        # Grid and flexbox utility layout classes
│   │   └── style.css         # Theme colors, typography, background glow
│   ├── js/
│   │   └── main.js           # Navbar scroll, AJAX favorite toggle, modal helpers
│   └── uploads/              # Storage directory for property image uploads
├── routes/
│   ├── adminRoutes.js        # Admin dashboard & property management routes
│   ├── indexRoutes.js        # Homepage, auth, user dashboard, & favorites routes
│   └── propertyRoutes.js     # Property listing & detail routes
├── views/
│   ├── admin/
│   │   └── dashboard.ejs     # Admin control panel page
│   ├── pages/
│   │   ├── 404.ejs           # Custom 404 error page
│   │   ├── dashboard.ejs     # User dashboard (Profile, Favorites, Visits)
│   │   ├── home.ejs          # Landing home page with hero search & featured cards
│   │   ├── login.ejs         # User login form
│   │   ├── properties.ejs    # Property listing page with filters
│   │   ├── property-details.ejs # Property detail page with contact modals
│   │   └── register.ejs      # User registration form
│   └── partials/
│       ├── breadcrumbs.ejs   # Reusable breadcrumb navigation header
│       ├── footer.ejs        # Footer layout
│       ├── head.ejs          # Head metadata & font references
│       └── navbar.ejs        # Top sticky navigation bar with user profile dropdown
├── .env                      # Environment variables (PORT, MONGO_URI, SESSION_SECRET)
├── package.json              # Dependencies and run scripts
├── seeder.js                 # Database seeder script for sample data
└── server.js                 # Entry point Express server initialization
```

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: Express Session, Connect-Mongo, Bcrypt.js
- **Templating Engine**: EJS (Embedded JavaScript)
- **Styling**: Modern Vanilla CSS3 with Glassmorphism Design System
- **Icons & Fonts**: FontAwesome 6, Google Fonts (Poppins)

---

## 📌 Project Maintenance

- **Status**: Active & Maintained
- **Last Updated**: August 10, 2026

