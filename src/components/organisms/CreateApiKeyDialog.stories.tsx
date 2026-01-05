import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/atoms/button'
import { CreateApiKeyDialog } from './CreateApiKeyDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof CreateApiKeyDialog> = {
  title: 'Organisms/CreateApiKeyDialog',
  component: CreateApiKeyDialog,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>[CREATE API KEY]</Button>
        <CreateApiKeyDialog
          organizationId="org-123"
          open={open}
          onOpenChange={setOpen}
        />
      </>
    )
  },
}

export const OpenedDialog: Story = {
  args: {
    organizationId: 'org-123',
    open: true,
    onOpenChange: () => {},
  },
}
