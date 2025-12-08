import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { JsonEditorToggle, type EditorMode } from './JsonEditorToggle'

const meta = {
  title: 'Triggers/JsonEditorToggle',
  component: JsonEditorToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JsonEditorToggle>

export default meta
type Story = StoryObj<typeof JsonEditorToggle>

// Wrapper component to handle state
function JsonEditorToggleWithState({ mode: initialMode = 'ui' as EditorMode, disabled = false }) {
  const [mode, setMode] = useState<EditorMode>(initialMode)

  return (
    <div className="w-[400px] p-8 bg-background">
      <div className="space-y-4">
        <div className="typo-ui text-terminal-dim">
          Current mode: <span className="text-terminal-green">{mode.toUpperCase()}</span>
        </div>
        <JsonEditorToggle mode={mode} onModeChange={setMode} disabled={disabled} />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <JsonEditorToggleWithState />,
}

export const UIMode: Story = {
  render: () => <JsonEditorToggleWithState mode="ui" />,
}

export const JSONMode: Story = {
  render: () => <JsonEditorToggleWithState mode="json" />,
}

export const Disabled: Story = {
  render: () => <JsonEditorToggleWithState disabled={true} />,
}
