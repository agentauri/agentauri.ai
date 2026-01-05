import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from '@/components/atoms/button'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Molecules/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>OPEN DIALOG</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="CONFIRM ACTION"
          description="Are you sure you want to proceed with this action?"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          DELETE ITEM
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="DELETE AGENT"
          description="This will permanently remove the agent from your organization. This action cannot be undone."
          confirmLabel="DELETE"
          variant="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}

export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setOpen(false)
      }, 2000)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>SAVE CHANGES</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="SAVE CHANGES"
          description="Your changes will be saved permanently."
          confirmLabel="SAVE"
          isLoading={loading}
          onConfirm={handleConfirm}
        />
      </>
    )
  },
}

export const CustomLabels: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>REVOKE ACCESS</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="REVOKE API KEY"
          description="This API key will be immediately invalidated."
          confirmLabel="REVOKE"
          cancelLabel="KEEP ACTIVE"
          variant="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    )
  },
}
