import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>SYSTEM STATUS</CardTitle>
        <CardDescription>Current system information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>All systems operational.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>AGENT PROFILE</CardTitle>
        <CardDescription>0x1234...5678</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-terminal-dim">Reputation:</div>
            <div className="text-terminal-green">85/100</div>
          </div>
          <div>
            <div className="text-terminal-dim">Transactions:</div>
            <div className="text-terminal-green">1,234</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">VIEW DETAILS</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>TRIGGER #42</CardTitle>
          <Badge variant="default">ACTIVE</Badge>
        </div>
        <CardDescription>Telegram notification trigger</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="typo-ui space-y-1">
          <div>Event: ReputationUpdate</div>
          <div>Action: Send message</div>
          <div>Last run: 2 min ago</div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">EDIT</Button>
        <Button variant="destructive" size="sm">DELETE</Button>
      </CardFooter>
    </Card>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>NETWORKS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="typo-header text-terminal-green">6</div>
          <p className="typo-ui text-muted-foreground">chains online</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>LATENCY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="typo-header text-terminal-green">&lt;1s</div>
          <p className="typo-ui text-muted-foreground">avg indexing</p>
        </CardContent>
      </Card>
    </div>
  ),
}
