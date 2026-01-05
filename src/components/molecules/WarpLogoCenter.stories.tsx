import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WarpLogoCenter } from './WarpLogoCenter'

const meta: Meta<typeof WarpLogoCenter> = {
  title: 'Molecules/WarpLogoCenter',
  component: WarpLogoCenter,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-screen flex items-center justify-center bg-terminal">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    animation: {
      control: 'select',
      options: ['emerge', 'pulse', 'none'],
    },
    emergeDuration: {
      control: { type: 'number', min: 500, max: 5000, step: 100 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'AGENTAURI.AI',
    animation: 'emerge',
    emergeDuration: 2000,
  },
}

export const NoAnimation: Story = {
  args: {
    text: 'AGENTAURI.AI',
    animation: 'none',
  },
}

export const FastEmergence: Story = {
  args: {
    text: 'AGENTAURI.AI',
    animation: 'emerge',
    emergeDuration: 500,
  },
}

export const SlowEmergence: Story = {
  args: {
    text: 'AGENTAURI.AI',
    animation: 'emerge',
    emergeDuration: 4000,
  },
}

export const CustomText: Story = {
  args: {
    text: 'CUSTOM BRAND',
    animation: 'none',
  },
}
