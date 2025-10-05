
#  TrueVal E-Commerce Platform

## Overview

**TrueVal** is a modern, responsive, and modular e-commerce front-end platform built for scalability and maintainability.
It delivers an elegant shopping experience with intelligent product discovery, persistent cart and favorites, dynamic filtering, and a fully functional checkout flow — all powered by modern web technologies.

TrueVal is designed as a **standalone front-end application** using local storage and dummy APIs (such as [DummyJSON](https://dummyjson.com/)) for demonstration, but can be easily integrated with any backend (Node.js, Django, Laravel, etc.) for production use.

![Landing Page](/landing-page.png)
---

## Table of Contents

* [Features](#features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Usage Guide](#usage-guide)
* [Folder & File Descriptions](#folder--file-descriptions)
* [Customization](#customization)
* [Future Enhancements](#future-enhancements)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

##  Features

###  User Interface

* **Fully Responsive Design** — Optimized for all screens (desktop, tablet, mobile).
* **Intuitive Navigation** — Includes a hamburger menu, dropdown categories, and overlay transitions.
* **Theme Variables** — Easily adjustable via `vars.css` for branding and color customization.

###  Product Interaction

* **Dynamic Product Fetching** — Retrieves product data from the [DummyJSON API](https://dummyjson.com/) and local JSON files.
* **Smart Search & Filters** — Supports text search and category-based filtering.
* **Voice Search Integration** — Powered by the Web Speech API for hands-free discovery.
* **Favorites System** — Persistent “wishlist” stored locally.
* **Cart Management** — Add, remove, and update quantities with real-time totals.

###  Checkout Experience

* **Interactive Checkout Page** — Includes form validation and order summary.
* **Local Persistence** — Cart and favorites remain saved between sessions.
* **Success Feedback** — Animated confirmation modal simulating order completion.

### Business & Developer Features

* **Seller Onboarding Section** — “Start Selling” informational flow.
* **Accessible & Semantic Markup** — ARIA roles and keyboard navigation support.
* **Maintainable Architecture** — Clean separation between HTML, CSS, and JS.
* **Scalable Assets** — Organized folder system for future expansion.

---

## Technology Stack

| Layer                 | Technology                                                |
| --------------------- | --------------------------------------------------------- |
| **Frontend**          | HTML5, CSS3 (Flexbox, Grid, Variables), JavaScript (ES6+) |
| **Data Source**       | [DummyJSON API](https://dummyjson.com/), Local JSON       |
| **Icons**             | [Bootstrap Icons](https://icons.getbootstrap.com/)        |
| **Animations**        | CSS transitions and keyframes                             |
| **State Persistence** | Local Storage API                                         |
| **Development Tools** | VS Code + Live Server Extension                           |

---

## Project Structure

```
TrueVal/
├── assets/
│   ├── css/
│   │   ├── vars.css          # Theme colors, typography, reusable variables
│   │   ├── base.css          # Global resets and core styles
│   │   └── responsive.css    # Media queries and adaptive layouts
│   ├── images/               # Brand assets and UI imagery
│   └── js/
│       ├── nav.js            # Navbar & mobile navigation logic
│       ├── carousel.js       # Landing page carousel interactions
│       └── seller.js         # Seller portal behaviors
│
├── index.html                # Landing page
│
├── Products/
│   ├── products.html         # Product listing page
│   ├── Example.json          # Local demo dataset
│   ├── css/products.css      # Grid and card system styling
│   └── js/products.js        # Fetch, filter, and search logic
│
├── Favourites/
│   ├── favourites.html       # Saved items page
│   └── js/favourites.js      # Favorites storage & display
│
├── Cart/
│   ├── cart.html             # Shopping cart page
│   ├── checkout.html         # Checkout page & order form
│   ├── css/checkout.css      # Checkout layout & modal
│   └── js/
│       ├── cart.js           # Quantity updates, totals, and persistence
│       └── checkout.js       # Validation and order confirmation
│
└── README.md
```

---

## Getting Started

### Prerequisites

* A modern browser supporting ES6 JavaScript and the Web Speech API
    *(Chrome, Edge, Firefox, Safari ≥ 14 recommended)*
* No backend setup required (uses dummy APIs and local JSON).

### Installation

1. **Clone the Repository**

     ```bash
     git clone https://github.com/yassenismail12/trueval.git
     cd trueval
     ```

2. **Run Locally**

     * Open `index.html` directly in your browser, **or**
     * Use VS Code’s **Live Server** extension for automatic reloading:

         ```bash
         code .
         ```

         then click **“Go Live”**.

---

## Usage Guide

| Action                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **Browse Products**     | View all available items with category and price info.    |
| **Search Products**     | Type keywords or use the voice icon to search.            |
| **Add to Favorites**    | Save products locally for later viewing.                  |
| **Add to Cart**         | Add items to your shopping cart; quantities persist.      |
| **Checkout**            | Enter name, email, and address; simulate order placement. |
| **Start Selling**       | Learn more about becoming a TrueVal seller.               |

---

## Folder & File Descriptions

| Folder            | Description                                             |
| ----------------- | ------------------------------------------------------- |
| **assets/css**    | Core global styling, responsive rules, theme variables. |
| **assets/js**     | Shared scripts (navigation, carousel, seller).          |
| **Products/**     | Product listing, search, and filtering system.          |
| **Favourites/**   | Favorite product management and grid display.           |
| **Cart/**         | Cart and checkout flows with persistence.               |
| **assets/images** | Logos, banners, sample assets for UI visuals.           |
| **index.html**    | Main landing page with featured content.                |

---

## Customization

| Area                    | How to Customize                                           |
| ----------------------- | ---------------------------------------------------------- |
| **Branding**            | Replace logos and images in `/assets/images/`.             |
| **Colors & Typography** | Update variables in `/assets/css/vars.css`.                |
| **Product Data**        | Edit `/Products/Example.json` or connect a real API.       |
| **Animations**          | Adjust CSS keyframes or transition timings in `/base.css`. |
| **Cart Behavior**       | Modify logic in `/Cart/cart.js` and `/Cart/checkout.js`.   |

---

## Future Enhancements

* User authentication (login/register).
* Real payment gateway integration (Stripe, PayPal).
* Order history dashboard.
* Product reviews and ratings system.
* Admin panel for inventory management.
* Dark mode toggle with theme persistence.
* Progressive Web App (PWA) optimization.

---

## Contributing

Contributions are **welcome and appreciated**

To contribute:

1. Fork the repository.
2. Create a new feature branch:

     ```bash
     git checkout -b feature/your-feature
     ```
3. Commit and push changes.
4. Submit a pull request with a detailed explanation.

For major proposals, open an issue first to discuss your idea.

---

## License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it with attribution.
See the [LICENSE](LICENSE) file for full details.

---

## Contact

**Author:** [Yassen Mohamed](mailto:yassenmismail@gmail.com)
Email: [yassenmismail@gmail.com](mailto:yassenmismail@gmail.com)
GitHub: [@yassenismail12](https://github.com/yassenismail12)

---

> **TrueVal © 2026** 

---

