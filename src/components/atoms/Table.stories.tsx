import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const meta: Meta<typeof Table> = {
  title: 'Atoms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleData = [
  { id: '0x1234...abcd', event: 'REPUTATION_UPDATED', chain: 'BASE', timestamp: '2025-01-05 12:00' },
  { id: '0x5678...efgh', event: 'AGENT_REGISTERED', chain: 'MAINNET', timestamp: '2025-01-05 11:30' },
  { id: '0x9abc...ijkl', event: 'SCORE_CHANGED', chain: 'SEPOLIA', timestamp: '2025-01-05 11:00' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>RECENT BLOCKCHAIN EVENTS</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>TX ID</TableHead>
          <TableHead>EVENT</TableHead>
          <TableHead>CHAIN</TableHead>
          <TableHead>TIMESTAMP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleData.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-mono">{row.id}</TableCell>
            <TableCell>{row.event}</TableCell>
            <TableCell>{row.chain}</TableCell>
            <TableCell>{row.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithTerminalStyling: Story = {
  render: () => (
    <Table className="border-2 border-terminal-dim">
      <TableHeader>
        <TableRow className="border-terminal-dim">
          <TableHead className="text-terminal-green">AGENT</TableHead>
          <TableHead className="text-terminal-green">STATUS</TableHead>
          <TableHead className="text-terminal-green">SCORE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="border-terminal-dim hover:bg-terminal-green/10">
          <TableCell className="text-terminal-green">agent-001</TableCell>
          <TableCell className="text-terminal-green">ACTIVE</TableCell>
          <TableCell className="text-terminal-green">85</TableCell>
        </TableRow>
        <TableRow className="border-terminal-dim hover:bg-terminal-green/10">
          <TableCell className="text-terminal-green">agent-002</TableCell>
          <TableCell className="text-terminal-dim">INACTIVE</TableCell>
          <TableCell className="text-terminal-green">72</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
