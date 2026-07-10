/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#7093dd',
        'brand-navy': '#243e6d',
        'brand-sky': '#629ef7',
        'brand-cream': '#e0cda7',
        'brand-tan': '#ceaf72',
        'brand-grey': '#f0f0f0',
      },
    },
  },
  plugins: [],
};
