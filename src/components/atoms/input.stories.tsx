import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'ENTER COMMAND...',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'EMAIL@DOMAIN.COM',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '********',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'DISABLED',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: '> SYSTEM READY',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'SEARCH...',
  },
}

export const InputGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Input placeholder="USERNAME" />
      <Input type="password" placeholder="PASSWORD" />
      <Input type="email" placeholder="EMAIL" />
    </div>
  ),
}
