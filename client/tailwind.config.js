/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
			backgroundImage: {
				'main-pattern': "url('assets/images/bg.jpg')", 
				'megumin': "url('assets/images/characters/megumin.png')",
				'redar': "url('assets/images/characters/redar.png')",
				'day': "url('assets/images/backgrounds/bg-light.png')",
				'night': "url('assets/images/backgrounds/bg-dark.png')"
			},
		},
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
	darkMode: 'selector',
}
