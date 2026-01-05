import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
        <TabsTrigger value="events">EVENTS</TabsTrigger>
        <TabsTrigger value="settings">SETTINGS</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 border-2 border-terminal-dim mt-2">
        <p className="typo-ui text-terminal-green">Agent overview information</p>
      </TabsContent>
      <TabsContent value="events" className="p-4 border-2 border-terminal-dim mt-2">
        <p className="typo-ui text-terminal-green">Recent events list</p>
      </TabsContent>
      <TabsContent value="settings" className="p-4 border-2 border-terminal-dim mt-2">
        <p className="typo-ui text-terminal-green">Configuration options</p>
      </TabsContent>
    </Tabs>
  ),
}

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="json" className="w-80">
      <TabsList>
        <TabsTrigger value="visual">VISUAL</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
      </TabsList>
      <TabsContent value="visual" className="p-4 border-2 border-terminal-dim mt-2">
        <p className="typo-ui text-terminal-green">Visual editor mode</p>
      </TabsContent>
      <TabsContent value="json" className="p-4 border-2 border-terminal-dim mt-2">
        <pre className="typo-code text-terminal-green">{'{ "mode": "json" }'}</pre>
      </TabsContent>
    </Tabs>
  ),
}
