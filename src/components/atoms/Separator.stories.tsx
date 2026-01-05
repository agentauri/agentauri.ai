import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="typo-ui text-terminal-green">SECTION ONE</p>
      <Separator className="my-4 bg-terminal-dim" />
      <p className="typo-ui text-terminal-green">SECTION TWO</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="typo-ui text-terminal-green">ITEM A</span>
      <Separator orientation="vertical" className="bg-terminal-dim" />
      <span className="typo-ui text-terminal-green">ITEM B</span>
      <Separator orientation="vertical" className="bg-terminal-dim" />
      <span className="typo-ui text-terminal-green">ITEM C</span>
    </div>
  ),
}
