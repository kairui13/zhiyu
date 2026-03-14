import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 大地色/奶茶色系 - 主色调
        cream: {
          50: '#FEFDFB',
          100: '#FDF8F0',
          200: '#FAF0E1',
          300: '#F5E6D0',
          400: '#EDD9BA',
          500: '#E4CBA4',
        },
        // 燕麦色 - 次要色
        oat: {
          50: '#F8F6F3',
          100: '#F0EBE3',
          200: '#E4DCD0',
          300: '#D4C9BA',
          400: '#C2B5A3',
          500: '#AEA08D',
        },
        // 雾霾蓝 - 强调色
        mist: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
        },
        // 鼠尾草绿 - 成功/积极色
        sage: {
          50: '#F4F7F4',
          100: '#E6EDE6',
          200: '#CEDFCE',
          300: '#A8C9A8',
          400: '#7FAF7F',
          500: '#5F9A5F',
        },
        // 暖灰 - 中性色
        warmgray: {
          50: '#FAF9F7',
          100: '#F5F3EF',
          200: '#E8E4DC',
          300: '#D4CFC3',
          400: '#B8B0A0',
          500: '#9C9280',
          600: '#7A7165',
          700: '#5C554B',
          800: '#3D3832',
          900: '#1F1C19',
        },
        // 情绪色彩
        emotion: {
          anxious: '#D4A574',    // 温暖的杏色 - 焦虑
          empty: '#A8B5C4',     // 灰蓝色 - 空虚
          low: '#B8A99A',       // 暖灰 - 低落
          calm: '#9FB3C8',      // 雾霾蓝 - 平静
          joyful: '#C4B08A',    // 暖黄 - 愉悦
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'bubble': '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
export default config