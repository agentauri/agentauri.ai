import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from './label'
import { Input } from './input'

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'FIELD LABEL',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">EMAIL ADDRESS</Label>
      <Input id="email" placeholder="agent@system.local" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name">
        AGENT NAME <span className="text-destructive">*</span>
      </Label>
      <Input id="name" placeholder="Enter agent name" />
    </div>
  ),
}
