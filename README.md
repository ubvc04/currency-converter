# Real-Time Currency Converter

A modern, responsive web app for real-time currency conversion using the [ExchangeRate API](https://www.exchangerate-api.com/). Built with pure HTML, CSS, and JavaScript—no frameworks required!

![screenshot](./screenshot.png)

## 🚀 Features

- Real-time currency conversion with up-to-date rates
- Supports 150+ currencies
- Country flags and currency logos in dropdowns
- Swap currencies with one click
- Responsive design for desktop & mobile
- Light/Dark mode toggle (remembers your choice)
- Animated, modern UI (cards, soft shadows, rounded corners)
- Error handling for invalid input and network issues
- Loading state for API calls
- Modular, well-commented code

## 🌐 Live Demo

You can deploy this app instantly to:
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

Or run locally (see below).

## 🛠️ Local Setup

1. **Clone or download this repo**
2. Open `index.html` in your browser

No build step or server required!

## 🚢 Deployment

- **Netlify/Vercel**: Drag and drop the `currency-converter` folder or connect your repo.
- **GitHub Pages**: Push to a GitHub repo, then enable Pages in repo settings (root or `/docs` folder).

## 📝 Customization

- **Add more currency logos/flags:**
  - Edit `scripts/app.js`, extend the `currencyMeta` object for more accurate flags/logos.
- **Theme colors:**
  - Tweak `styles/style.css` for your brand colors.
- **API Key:**
  - Replace the API key in `scripts/app.js` with your own from [ExchangeRate API](https://www.exchangerate-api.com/).

## 🙏 Credits

- [ExchangeRate API](https://www.exchangerate-api.com/) for currency data
- [FontAwesome](https://fontawesome.com/) for currency icons
- [FlagCDN](https://flagcdn.com/) for country flags
- UI inspired by modern card-based design

---

**Made with ❤️ using only HTML, CSS, and JavaScript.** 