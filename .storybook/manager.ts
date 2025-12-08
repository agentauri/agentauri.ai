import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'AGENTAURI.AI DESIGN SYSTEM',
    brandUrl: 'https://agentauri.ai',

    // Colors
    colorPrimary: '#33FF33',
    colorSecondary: '#33FF33',

    // UI
    appBg: '#0a0a0a',
    appContentBg: '#0a0a0a',
    appBorderColor: '#1a8c1a',
    appBorderRadius: 0,

    // Text
    textColor: '#33FF33',
    textInverseColor: '#0a0a0a',
    textMutedColor: '#1a8c1a',

    // Toolbar
    barTextColor: '#33FF33',
    barSelectedColor: '#66FF66',
    barHoverColor: '#66FF66',
    barBg: '#0a0a0a',

    // Form
    inputBg: '#0a0a0a',
    inputBorder: '#33FF33',
    inputTextColor: '#33FF33',
    inputBorderRadius: 0,

    // Buttons
    buttonBg: '#0a0a0a',
    buttonBorder: '#33FF33',
    booleanBg: '#0a0a0a',
    booleanSelectedBg: '#33FF33',
  }),
})
