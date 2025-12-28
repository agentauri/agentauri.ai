import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OAuthButtons } from './OAuthButtons'

const meta: Meta<typeof OAuthButtons> = {
  title: 'Molecules/OAuthButtons',
  component: OAuthButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    providers: {
      control: 'multi-select',
      options: ['google', 'github'],
    },
    isLoading: {
      control: 'boolean',
    },
    redirectAfter: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-terminal border border-terminal-dim rounded">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OAuthButtons>

export const Default: Story = {
  args: {},
}

export const GoogleOnly: Story = {
  args: {
    providers: ['google'],
  },
}

export const GitHubOnly: Story = {
  args: {
    providers: ['github'],
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const WithCustomRedirect: Story = {
  args: {
    redirectAfter: '/dashboard/settings',
  },
}
