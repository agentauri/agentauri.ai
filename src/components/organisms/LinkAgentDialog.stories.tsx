import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { Button } from '@/components/atoms/button'
import { LinkAgentDialog } from './LinkAgentDialog'
import { wagmiConfig } from '@/lib/wagmi-config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof LinkAgentDialog> = {
  title: 'Organisms/LinkAgentDialog',
  component: LinkAgentDialog,
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
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </WagmiProvider>
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
        <Button onClick={() => setOpen(true)}>[LINK AGENT]</Button>
        <LinkAgentDialog
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
