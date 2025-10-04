/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins-Regular', 'sans-serif'],
        "poppins-bold": ['Poppins-Bold', 'sans-serif'],
        "poppins-extrabold": ['Poppins-ExtraBold', 'sans-serif'],
        "poppins-light": ['Poppins-Light', 'sans-serif'],
        "poppins-medium": ['Poppins-Medium', 'sans-serif'],
        "poppins-semibold": ['Poppins-SemiBold', 'sans-serif']
      }
    },
    colors: {
      "primary": {
        100: '#BA1D84',
        200: '#BA1D841A',
        300: '#BA1D842A'
      },
      black: {
        DEFAULT: '#000000',
        100: '#8C8E98',
        200: '#666876',
        300: '#191d31'
      },
      white: {
        DEFAULT: '#FFFFFF'
      },
      danger: '#F75555'
    }
  },
  plugins: [],
}