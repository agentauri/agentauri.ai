import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { ArrayFieldBuilder, FormArrayFieldBuilder } from './ArrayFieldBuilder'

const meta = {
  title: 'Shared/ArrayFieldBuilder',
  component: ArrayFieldBuilder,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArrayFieldBuilder>

export default meta
type Story = StoryObj<typeof ArrayFieldBuilder>

// Simple string item for demos
interface SimpleItem {
  value: string
}

// Component that renders a simple text input
function SimpleItemRenderer({ item, onChange }: { item: SimpleItem; onChange: (item: SimpleItem) => void }) {
  return (
    <Box variant="secondary" padding="md">
      <Label htmlFor="item-value" className="typo-ui">
        VALUE
      </Label>
      <Input
        id="item-value"
        type="text"
        value={item.value}
        onChange={(e) => onChange({ value: e.target.value })}
        className="typo-ui mt-2"
        placeholder="Enter value..."
      />
    </Box>
  )
}

// Wrapper with state management
function ArrayFieldBuilderDemo({
  initialItems = [],
  minItems = 1,
}: {
  initialItems?: SimpleItem[]
  minItems?: number
}) {
  const [items, setItems] = useState<SimpleItem[]>(initialItems)

  const handleAdd = () => {
    setItems([...items, { value: '' }])
  }

  const handleUpdate = (index: number, item: SimpleItem) => {
    const newItems = [...items]
    newItems[index] = item
    setItems(newItems)
  }

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-4 typo-ui text-terminal-green">
        &gt; ARRAY FIELD BUILDER DEMO
      </Box>
      <ArrayFieldBuilder
        items={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        canRemove={items.length > minItems}
        addButtonLabel="[+] ADD ITEM"
        renderItem={(item, index) => (
          <SimpleItemRenderer
            item={item}
            onChange={(updated) => handleUpdate(index, updated)}
          />
        )}
        emptyMessage="No items yet. Click 'Add Item' to get started."
      />
      <Box variant="subtle" padding="md" className="mt-6">
        <div className="typo-ui text-terminal-green mb-2">&gt; Current State:</div>
        <pre className="typo-code text-terminal-dim overflow-x-auto">
          {JSON.stringify(items, null, 2)}
        </pre>
      </Box>
    </div>
  )
}

// Form wrapper demo
function FormArrayFieldBuilderDemo({
  hasError = false,
}: {
  hasError?: boolean
}) {
  const [items, setItems] = useState<SimpleItem[]>([{ value: 'Item 1' }])

  const handleAdd = () => {
    setItems([...items, { value: '' }])
  }

  const handleUpdate = (index: number, item: SimpleItem) => {
    const newItems = [...items]
    newItems[index] = item
    setItems(newItems)
  }

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-4 typo-ui text-terminal-green">
        &gt; FORM ARRAY FIELD BUILDER DEMO
      </Box>
      <FormArrayFieldBuilder
        value={items}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        addButtonLabel="[+] ADD ITEM"
        renderItem={(item, index) => (
          <SimpleItemRenderer
            item={item}
            onChange={(updated) => handleUpdate(index, updated)}
          />
        )}
        emptyMessage="No items. Add at least one item."
        error={hasError ? 'At least one item is required' : undefined}
        minItems={1}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <ArrayFieldBuilderDemo initialItems={[{ value: 'Item 1' }, { value: 'Item 2' }]} />,
}

export const Empty: Story = {
  render: () => <ArrayFieldBuilderDemo initialItems={[]} />,
}

export const SingleItem: Story = {
  render: () => <ArrayFieldBuilderDemo initialItems={[{ value: 'Cannot remove this' }]} minItems={1} />,
}

export const ManyItems: Story = {
  render: () => <ArrayFieldBuilderDemo
    initialItems={[
      { value: 'Item 1' },
      { value: 'Item 2' },
      { value: 'Item 3' },
      { value: 'Item 4' },
      { value: 'Item 5' },
    ]}
  />,
}

export const FormWrapper: Story = {
  render: () => <FormArrayFieldBuilderDemo hasError={false} />,
}

export const FormWrapperWithError: Story = {
  render: () => <FormArrayFieldBuilderDemo hasError={true} />,
}
