import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon, type IconName } from './icon'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'dashboard', 'triggers', 'events', 'agents', 'api-keys', 'settings',
        'close', 'add', 'remove', 'help', 'warning', 'info', 'check', 'retry', 'copy', 'edit', 'send',
        'active', 'inactive', 'star',
        'arrow-right', 'arrow-up', 'arrow-down', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down',
        'expand', 'collapse', 'active-nav',
        'not-equal', 'greater-equal', 'less-equal',
        'chart', 'robot', 'lightning', 'search', 'clock',
        'logo', 'menu',
      ] as IconName[],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'dashboard',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-terminal-green">
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size="xs" />
        <span className="typo-ui text-terminal-dim">XS</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size="sm" />
        <span className="typo-ui text-terminal-dim">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size="md" />
        <span className="typo-ui text-terminal-dim">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size="lg" />
        <span className="typo-ui text-terminal-dim">LG</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon name="dashboard" size="xl" />
        <span className="typo-ui text-terminal-dim">XL</span>
      </div>
    </div>
  ),
}

export const NavigationIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 text-terminal-green">
      {(['dashboard', 'triggers', 'events', 'agents', 'api-keys', 'settings'] as IconName[]).map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size="lg" />
          <span className="typo-ui text-terminal-dim text-[8px]">{name.toUpperCase()}</span>
        </div>
      ))}
    </div>
  ),
}

export const ActionIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 text-terminal-green">
      {(['close', 'add', 'remove', 'help', 'warning', 'info', 'check', 'retry', 'copy', 'edit', 'send'] as IconName[]).map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size="lg" />
          <span className="typo-ui text-terminal-dim text-[8px]">{name.toUpperCase()}</span>
        </div>
      ))}
    </div>
  ),
}

export const ArrowIcons: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4 text-terminal-green">
      {(['arrow-right', 'arrow-up', 'arrow-down', 'chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', 'expand', 'collapse', 'active-nav'] as IconName[]).map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size="lg" />
          <span className="typo-ui text-terminal-dim text-[8px]">{name.toUpperCase()}</span>
        </div>
      ))}
    </div>
  ),
}

export const StatusIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 text-terminal-green">
      {(['active', 'inactive', 'star'] as IconName[]).map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} size="lg" />
          <span className="typo-ui text-terminal-dim text-[8px]">{name.toUpperCase()}</span>
        </div>
      ))}
    </div>
  ),
}
