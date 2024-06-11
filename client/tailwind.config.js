/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
			backgroundImage: {
				'main-pattern': "url('assets/img/bg.jpg')", 
			},
		},
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
