import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ApiErrorDisplay } from './ApiErrorDisplay'
import { ApiError } from '@/lib/api-client'

const meta: Meta<typeof ApiErrorDisplay> = {
  title: 'Molecules/ApiErrorDisplay',
  component: ApiErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const NetworkError: Story = {
  args: {
    error: new Error('Network Error'),
    title: 'Failed to load data',
  },
}

export const BadRequest: Story = {
  args: {
    error: new ApiError(400, 'Bad Request'),
    title: 'Invalid request',
  },
}

export const Unauthorized: Story = {
  args: {
    error: new ApiError(401, 'Unauthorized'),
    title: 'Authentication required',
  },
}

export const Forbidden: Story = {
  args: {
    error: new ApiError(403, 'Forbidden'),
    title: 'Access denied',
  },
}

export const NotFound: Story = {
  args: {
    error: new ApiError(404, 'Not Found'),
    title: 'Resource not found',
  },
}

export const TooManyRequests: Story = {
  args: {
    error: new ApiError(429, 'Too Many Requests'),
    title: 'Rate limited',
  },
}

export const ServerError: Story = {
  args: {
    error: new ApiError(500, 'Internal Server Error'),
    title: 'Server error',
  },
}

export const ServiceUnavailable: Story = {
  args: {
    error: new ApiError(503, 'Service Unavailable'),
    title: 'Backend offline',
  },
}

export const WithCustomMessage: Story = {
  args: {
    error: new ApiError(400, 'Custom error', { message: 'Email already exists' }),
    title: 'Registration failed',
  },
}

export const NoError: Story = {
  args: {
    error: null,
    title: 'No error',
  },
}
