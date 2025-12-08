import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AlertBanner } from './AlertBanner'

const meta = {
  title: 'Shared/AlertBanner',
  component: AlertBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertBanner>

export default meta
type Story = StoryObj<typeof AlertBanner>

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'This is an informational message.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    message: 'Operation completed successfully!',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'Please review your settings before proceeding.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    message: 'Failed to save changes. Please try again.',
  },
}

export const Dismissible: Story = {
  args: {
    variant: 'info',
    message: 'This banner can be dismissed.',
    dismissible: true,
  },
}

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Update Available',
    message: 'A new version is available. Update now to get the latest features.',
    action: {
      label: 'UPDATE',
      onClick: () => console.log('Update clicked'),
    },
    dismissible: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background space-y-4">
      <AlertBanner
        variant="info"
        title="Info"
        message="System maintenance scheduled for tonight."
        dismissible
      />
      <AlertBanner
        variant="success"
        title="Success"
        message="Your trigger has been created successfully."
        dismissible
      />
      <AlertBanner
        variant="warning"
        title="Warning"
        message="Your subscription will expire in 3 days."
        action={{ label: 'RENEW', onClick: () => {} }}
      />
      <AlertBanner
        variant="error"
        title="Error"
        message="Failed to connect to blockchain node."
        action={{ label: 'RETRY', onClick: () => {} }}
        dismissible
      />
    </div>
  ),
}
