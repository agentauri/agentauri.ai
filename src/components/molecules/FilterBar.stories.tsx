import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { Input } from '@/components/atoms/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { FilterBar, FilterGroup, FilterItem } from './FilterBar'

const meta = {
  title: 'Shared/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof FilterBar>

// Demo with state
function FilterBarDemo() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  const hasFilters = search !== '' || status !== 'all' || category !== 'all'

  const handleClear = () => {
    setSearch('')
    setStatus('all')
    setCategory('all')
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-4 typo-ui text-terminal-green">
        &gt; FILTER BAR DEMO
      </Box>

      <FilterBar
        onClearFilters={handleClear}
        hasActiveFilters={hasFilters}
        resultsCount={42}
        totalCount={100}
        resultsLabel="ITEMS"
      >
        <FilterGroup columns={4}>
          {/* Search */}
          <FilterItem className="md:col-span-4">
            <Input
              type="text"
              placeholder="> SEARCH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="typo-ui"
            />
          </FilterItem>

          {/* Status Filter */}
          <FilterItem label="STATUS">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="active" className="typo-ui">ACTIVE</SelectItem>
                <SelectItem value="inactive" className="typo-ui">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Category Filter */}
          <FilterItem label="CATEGORY">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="type-a" className="typo-ui">TYPE A</SelectItem>
                <SelectItem value="type-b" className="typo-ui">TYPE B</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>

      {/* Mock results */}
      <Box variant="subtle" padding="md" className="mt-6">
        <div className="typo-ui text-terminal-green mb-2">&gt; Current Filters:</div>
        <pre className="typo-code text-terminal-dim">
          {JSON.stringify({ search, status, category, hasFilters }, null, 2)}
        </pre>
      </Box>
    </div>
  )
}

export const Default: Story = {
  render: () => <FilterBarDemo />,
}

export const SimpleFilters: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <FilterBar resultsCount={25} resultsLabel="TRIGGERS">
        <FilterGroup columns={3}>
          <FilterItem>
            <Input type="text" placeholder="Search..." className="typo-ui" />
          </FilterItem>
          <FilterItem>
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL STATUS</SelectItem>
                <SelectItem value="enabled" className="typo-ui">ENABLED</SelectItem>
                <SelectItem value="disabled" className="typo-ui">DISABLED</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}

export const WithClearButton: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <FilterBar
        onClearFilters={() => console.log('Clear filters')}
        hasActiveFilters={true}
        resultsCount={10}
        totalCount={50}
      >
        <FilterGroup columns={2}>
          <FilterItem>
            <Input type="text" defaultValue="test search" className="typo-ui" />
          </FilterItem>
          <FilterItem>
            <Select defaultValue="active">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="active" className="typo-ui">ACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}

export const NoActiveFilters: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <FilterBar
        onClearFilters={() => console.log('Clear filters')}
        hasActiveFilters={false}
        resultsCount={100}
        totalCount={100}
      >
        <FilterGroup columns={3}>
          <FilterItem>
            <Input type="text" placeholder="Search..." className="typo-ui" />
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}

export const TwoColumnLayout: Story = {
  render: () => (
    <div className="max-w-3xl mx-auto p-8 bg-background">
      <FilterBar resultsCount={15}>
        <FilterGroup columns={2}>
          <FilterItem label="SEARCH">
            <Input type="text" placeholder="Type to search..." className="typo-ui" />
          </FilterItem>
          <FilterItem label="FILTER BY">
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="recent" className="typo-ui">RECENT</SelectItem>
                <SelectItem value="popular" className="typo-ui">POPULAR</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}

export const ThreeColumnLayout: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      <FilterBar resultsCount={8} totalCount={24}>
        <FilterGroup columns={3}>
          <FilterItem label="NAME">
            <Input type="text" placeholder="Filter by name..." className="typo-ui" />
          </FilterItem>
          <FilterItem label="TYPE">
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL TYPES</SelectItem>
                <SelectItem value="a" className="typo-ui">TYPE A</SelectItem>
                <SelectItem value="b" className="typo-ui">TYPE B</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="STATUS">
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="active" className="typo-ui">ACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}

export const ComplexFilters: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-8 bg-background">
      <FilterBar
        onClearFilters={() => console.log('Clear')}
        hasActiveFilters={true}
        resultsCount={5}
        totalCount={150}
        resultsLabel="MATCHES"
      >
        <FilterGroup columns={4}>
          <FilterItem label="SEARCH" className="md:col-span-4">
            <Input type="text" placeholder="> GLOBAL SEARCH..." className="typo-ui" />
          </FilterItem>

          <FilterItem label="CHAIN">
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL CHAINS</SelectItem>
                <SelectItem value="1" className="typo-ui">ETHEREUM</SelectItem>
                <SelectItem value="8453" className="typo-ui">BASE</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="REGISTRY">
            <Select defaultValue="all">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL REGISTRIES</SelectItem>
                <SelectItem value="reputation" className="typo-ui">REPUTATION</SelectItem>
                <SelectItem value="identity" className="typo-ui">IDENTITY</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="STATUS">
            <Select defaultValue="enabled">
              <SelectTrigger className="typo-ui">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="typo-ui">ALL</SelectItem>
                <SelectItem value="enabled" className="typo-ui">ENABLED</SelectItem>
                <SelectItem value="disabled" className="typo-ui">DISABLED</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="DATE RANGE">
            <Input type="date" className="typo-ui" />
          </FilterItem>
        </FilterGroup>
      </FilterBar>
    </div>
  ),
}
