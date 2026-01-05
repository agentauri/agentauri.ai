import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: false,
  },
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex items-center gap-2">
        <Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="terms">ACCEPT TERMS</Label>
      </div>
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <span className="typo-ui">CLICK TO TOGGLE</span>
        </div>
        <p className="typo-ui text-terminal-dim">
          STATE: {checked ? 'CHECKED' : 'UNCHECKED'}
        </p>
      </div>
    )
  },
}
