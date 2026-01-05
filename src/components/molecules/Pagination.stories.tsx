import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
    },
    showFirstLast: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4">
        <Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={setPage}
        />
        <p className="typo-ui text-terminal-dim">CURRENT PAGE: {page}</p>
      </div>
    )
  },
}

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <Pagination
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
      />
    )
  },
}

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(5)
    return (
      <Pagination
        currentPage={page}
        totalPages={20}
        onPageChange={setPage}
      />
    )
  },
}

export const WithFirstLast: Story = {
  render: () => {
    const [page, setPage] = useState(5)
    return (
      <Pagination
        currentPage={page}
        totalPages={20}
        onPageChange={setPage}
        showFirstLast
      />
    )
  },
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
}
