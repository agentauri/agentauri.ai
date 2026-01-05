import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { ApiKeyCreatedDialog } from './ApiKeyCreatedDialog'

const meta: Meta<typeof ApiKeyCreatedDialog> = {
  title: 'Organisms/ApiKeyCreatedDialog',
  component: ApiKeyCreatedDialog,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'terminal',
      values: [{ name: 'terminal', value: '#0A0A0A' }],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleApiKey = '8004_sk_test_1234567890abcdefghijklmnopqrstuvwxyz'

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>[SHOW KEY DIALOG]</Button>
        <ApiKeyCreatedDialog
          apiKey={sampleApiKey}
          open={open}
          onOpenChange={setOpen}
        />
      </>
    )
  },
}

export const OpenedDialog: Story = {
  args: {
    apiKey: sampleApiKey,
    open: true,
    onOpenChange: () => {},
  },
}

export const ShortKey: Story = {
  args: {
    apiKey: '8004_sk_short',
    open: true,
    onOpenChange: () => {},
  },
}

export const LongKey: Story = {
  args: {
    apiKey: '8004_sk_live_this_is_a_very_long_api_key_that_should_wrap_properly_in_the_dialog_box_12345',
    open: true,
    onOpenChange: () => {},
  },
}
