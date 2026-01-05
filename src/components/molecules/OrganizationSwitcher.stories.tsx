import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { OrganizationSwitcher } from './OrganizationSwitcher'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof OrganizationSwitcher> = {
  title: 'Molecules/OrganizationSwitcher',
  component: OrganizationSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-64 bg-terminal p-4">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    collapsed: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockOrganizations = [
  { id: '1', name: 'Acme Corp', my_role: 'owner' as const },
  { id: '2', name: 'Tech Startup', my_role: 'admin' as const },
  { id: '3', name: 'Side Project', my_role: 'member' as const },
]

const mockCurrentOrg = {
  id: '1',
  name: 'Acme Corp',
  my_role: 'owner' as const,
}

export const Default: Story = {
  args: {
    collapsed: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({ data: mockOrganizations })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json(mockCurrentOrg)
        }),
      ],
    },
  },
}

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({ data: mockOrganizations })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json(mockCurrentOrg)
        }),
      ],
    },
  },
}

export const AdminRole: Story = {
  args: {
    collapsed: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({ data: mockOrganizations })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json({
            id: '2',
            name: 'Tech Startup',
            my_role: 'admin',
          })
        }),
      ],
    },
  },
}

export const MemberRole: Story = {
  args: {
    collapsed: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({ data: mockOrganizations })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json({
            id: '3',
            name: 'Side Project',
            my_role: 'member',
          })
        }),
      ],
    },
  },
}

export const SingleOrganization: Story = {
  args: {
    collapsed: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({
            data: [{ id: '1', name: 'My Only Org', my_role: 'owner' }],
          })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json({
            id: '1',
            name: 'My Only Org',
            my_role: 'owner',
          })
        }),
      ],
    },
  },
}

export const NoOrganizations: Story = {
  args: {
    collapsed: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/organizations', () => {
          return HttpResponse.json({ data: [] })
        }),
        http.get('/api/organizations/current', () => {
          return HttpResponse.json(null)
        }),
      ],
    },
  },
}
