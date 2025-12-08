import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'terminal',
      values: [
        { name: 'terminal', value: '#0a0a0a' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard/triggers',
        query: {},
        push(...args: any[]) {
          console.log('[Storybook Router] push called with:', ...args)
          return Promise.resolve(true)
        },
        replace(...args: any[]) {
          console.log('[Storybook Router] replace called with:', ...args)
          return Promise.resolve(true)
        },
        prefetch() {
          return Promise.resolve()
        },
        back() {
          console.log('[Storybook Router] back called')
        },
        forward() {
          console.log('[Storybook Router] forward called')
        },
        refresh() {
          console.log('[Storybook Router] refresh called')
        },
      },
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            fontFamily: '"Press Start 2P", monospace',
            color: '#33FF33',
          },
        },
        React.createElement(Story)
      ),
  ],
}

export default preview
