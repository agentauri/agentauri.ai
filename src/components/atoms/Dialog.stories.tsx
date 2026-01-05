import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta<typeof Dialog> = {
  title: 'Atoms/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>OPEN DIALOG</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DIALOG TITLE</DialogTitle>
          <DialogDescription>
            This is a description of what the dialog does.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="typo-ui text-terminal-green">Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">CANCEL</Button>
          <Button>CONFIRM</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>CREATE NEW</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CREATE API KEY</DialogTitle>
          <DialogDescription>
            Enter a name for your new API key.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">KEY NAME</Label>
            <Input id="name" placeholder="production-key" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">CANCEL</Button>
          <Button>CREATE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">DELETE</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CONFIRM DELETION</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">CANCEL</Button>
          <Button variant="destructive">DELETE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
