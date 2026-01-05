import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WarpHomepage } from './WarpHomepage'

const meta: Meta<typeof WarpHomepage> = {
  title: 'Organisms/WarpHomepage',
  component: WarpHomepage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showNav: {
      control: 'boolean',
    },
    navDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
    },
    starCount: {
      control: { type: 'number', min: 50, max: 500, step: 50 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    showNav: true,
    navDelay: 500,
  },
}

export const NoNav: Story = {
  args: {
    showNav: false,
  },
}

export const FastAnimation: Story = {
  args: {
    showNav: true,
    navDelay: 0,
  },
}

export const FewStars: Story = {
  args: {
    showNav: true,
    starCount: 100,
  },
}

export const ManyStars: Story = {
  args: {
    showNav: true,
    starCount: 500,
  },
}
