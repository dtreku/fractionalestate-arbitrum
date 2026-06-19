import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { arbitrum: { blue: '#12AAFF', dark: '#213147' } } } },
  plugins: [],
};
export default config;
