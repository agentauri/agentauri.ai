import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from '@/components/atoms/button'
import { CreateOrganizationDialog } from './CreateOrganizationDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof CreateOrganizationDialog> = {
  title: 'Organisms/CreateOrganizationDialog',
  component: CreateOrganizationDialog,
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
        <Button onClick={() => setOpen(true)}>[CREATE ORGANIZATION]</Button>
        <CreateOrganizationDialog
          open={open}
          onOpenChange={setOpen}
        />
      </>
    )
  },
}

export const OpenedDialog: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
}
