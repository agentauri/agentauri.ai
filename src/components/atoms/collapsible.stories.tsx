import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Collapsible } from './collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  args: {
    title: 'SHOW MORE',
    children: (
      <div className="typo-ui text-terminal-dim">
        This is the collapsible content that appears when expanded.
      </div>
    ),
  },
}

export const DefaultOpen: Story = {
  args: {
    title: 'DETAILS',
    defaultOpen: true,
    children: (
      <div className="typo-ui text-terminal-dim">
        This collapsible starts in the open state.
      </div>
    ),
  },
}

export const WithCode: Story = {
  args: {
    title: 'SHOW EXAMPLE',
    variant: 'subtle',
    children: (
      <pre className="typo-code text-terminal-dim overflow-x-auto">
        {JSON.stringify(
          {
            name: 'Example Config',
            enabled: true,
            options: {
              key: 'value',
            },
          },
          null,
          2
        )}
      </pre>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-xl">
      <Collapsible title="DEFAULT VARIANT" variant="default">
        <div className="typo-ui text-terminal-dim">Default variant content</div>
      </Collapsible>
      <Collapsible title="SECONDARY VARIANT" variant="secondary">
        <div className="typo-ui text-terminal-dim">Secondary variant content</div>
      </Collapsible>
      <Collapsible title="SUBTLE VARIANT" variant="subtle">
        <div className="typo-ui text-terminal-dim">Subtle variant content</div>
      </Collapsible>
      <Collapsible title="SUCCESS VARIANT" variant="success">
        <div className="typo-ui text-terminal-dim">Success variant content</div>
      </Collapsible>
      <Collapsible title="ERROR VARIANT" variant="error">
        <div className="typo-ui text-terminal-dim">Error variant content</div>
      </Collapsible>
    </div>
  ),
}
