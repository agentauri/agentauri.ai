import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="SELECT CHAIN" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mainnet">MAINNET</SelectItem>
        <SelectItem value="base">BASE</SelectItem>
        <SelectItem value="sepolia">SEPOLIA</SelectItem>
        <SelectItem value="base-sepolia">BASE SEPOLIA</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="SELECT NETWORK" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>MAINNET</SelectLabel>
          <SelectItem value="ethereum">ETHEREUM</SelectItem>
          <SelectItem value="base">BASE</SelectItem>
          <SelectItem value="polygon">POLYGON</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>TESTNET</SelectLabel>
          <SelectItem value="sepolia">SEPOLIA</SelectItem>
          <SelectItem value="base-sepolia">BASE SEPOLIA</SelectItem>
          <SelectItem value="polygon-amoy">POLYGON AMOY</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="STATUS" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">ACTIVE</SelectItem>
        <SelectItem value="inactive">INACTIVE</SelectItem>
        <SelectItem value="pending">PENDING</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="DISABLED" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option">OPTION</SelectItem>
      </SelectContent>
    </Select>
  ),
}
