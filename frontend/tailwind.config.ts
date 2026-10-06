import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nctu: {
          red: '#D72134',
          'red-dark': '#B71526',
          'red-light': '#FEE2E2',
          navy: '#25359D',
          'navy-dark': '#1A2570',
          blue: '#0056D6',
          gold: '#FFD24B',
          'gold-hover': '#F2C130',
          cream: '#FFFBF2',
        },
      },
      fontFamily: {
        sans: ['"Momo Trust Sans"', '"Google Sans"', '"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        momo: ['"Momo Trust Sans"', '"Google Sans"', '"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        'google-sans': ['"Momo Trust Sans"', '"Google Sans"', '"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Momo Trust Sans"', '"Google Sans"', '"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        certificate: '0 20px 40px -15px rgba(37, 53, 157, 0.12), 0 0 0 1px rgba(37, 53, 157, 0.08)',
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'beautiful-sm': '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)',
        'beautiful-md': '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 1px -0.5px rgba(0,0,0,0.06), 0px 3px 3px -1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.06), 0px 12px 12px -6px rgba(0,0,0,0.06), 0px 24px 24px -12px rgba(0,0,0,0.06)',
        'beautiful-lg': '0 2.8px 2.2px rgba(0,0,0,0.034), 0 6.7px 5.3px rgba(0,0,0,0.048), 0 12.5px 10px rgba(0,0,0,0.06), 0 22.3px 17.9px rgba(0,0,0,0.072), 0 41.8px 33.4px rgba(0,0,0,0.086), 0 100px 80px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
