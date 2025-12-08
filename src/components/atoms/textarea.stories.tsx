import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from './textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Type your message...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'This is some text content',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
}

export const TerminalStyle: Story = {
  args: {
    placeholder: '> ENTER DESCRIPTION...',
    className: 'typo-ui font-mono',
    rows: 5,
  },
}
