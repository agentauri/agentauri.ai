import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { OrganizationRole } from '@/lib/constants'
import { Badge, Skeleton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { UserIcon } from 'lucide-react'

// Create a mock presentational component for stories
// The real component uses hooks that can't be easily mocked in Storybook
interface SidebarUserInfoMockProps {
  collapsed?: boolean
  className?: string
  username?: string
  orgName?: string
  userRole?: OrganizationRole
  isLoading?: boolean
}

const ROLE_COLORS: Record<OrganizationRole, string> = {
  owner: 'border-yellow-400 text-yellow-400',
  admin: 'border-terminal-green text-terminal-green',
  member: 'border-terminal-dim text-terminal-dim',
  viewer: 'border-gray-500 text-gray-500',
}

function SidebarUserInfoMock({
  collapsed = false,
  className,
  username = 'testuser',
  orgName = 'Test Organization',
  userRole = 'member',
  isLoading = false,
}: SidebarUserInfoMockProps) {
  if (isLoading) {
    return (
      <div className={cn('px-3 py-2', className)}>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          )}
        </div>
      </div>
    )
  }

  const content = (
    <div
      className={cn(
        'flex items-center gap-2 w-full cursor-pointer',
        'hover:bg-terminal-green/5 transition-colors rounded',
        'px-3 py-2',
        className
      )}
    >
      <UserIcon className="w-5 h-5 text-terminal-green shrink-0" />
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="typo-ui text-terminal-green truncate text-sm">
            {username}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="typo-ui text-terminal-dim text-xs truncate">
              {orgName}
            </span>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-1 py-0 h-4', ROLE_COLORS[userRole])}
            >
              {userRole.toUpperCase()}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-terminal border-terminal-dim">
            <div className="text-terminal-green typo-ui text-sm">{username}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-terminal-dim text-xs">{orgName}</span>
              <Badge
                variant="outline"
                className={cn('text-[10px] px-1 py-0 h-4', ROLE_COLORS[userRole])}
              >
                {userRole.toUpperCase()}
              </Badge>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

const meta: Meta<typeof SidebarUserInfoMock> = {
  title: 'Molecules/SidebarUserInfo',
  component: SidebarUserInfoMock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    collapsed: {
      control: 'boolean',
    },
    userRole: {
      control: 'select',
      options: ['owner', 'admin', 'member', 'viewer'],
    },
    isLoading: {
      control: 'boolean',
    },
    username: {
      control: 'text',
    },
    orgName: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-2 bg-terminal border border-terminal-dim rounded">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SidebarUserInfoMock>

export const Default: Story = {
  args: {
    username: 'matteo',
    orgName: 'AgentAuri Labs',
    userRole: 'owner',
  },
}

export const OwnerRole: Story = {
  args: {
    username: 'admin',
    orgName: 'My Organization',
    userRole: 'owner',
  },
}

export const AdminRole: Story = {
  args: {
    username: 'teammember',
    orgName: 'Team Workspace',
    userRole: 'admin',
  },
}

export const MemberRole: Story = {
  args: {
    username: 'developer',
    orgName: 'Development Team',
    userRole: 'member',
  },
}

export const ViewerRole: Story = {
  args: {
    username: 'guest',
    orgName: 'Read-Only Org',
    userRole: 'viewer',
  },
}

export const Collapsed: Story = {
  args: {
    collapsed: true,
    username: 'matteo',
    orgName: 'AgentAuri Labs',
    userRole: 'owner',
  },
  decorators: [
    (Story) => (
      <div className="w-16 p-2 bg-terminal border border-terminal-dim rounded">
        <Story />
      </div>
    ),
  ],
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const LoadingCollapsed: Story = {
  args: {
    isLoading: true,
    collapsed: true,
  },
  decorators: [
    (Story) => (
      <div className="w-16 p-2 bg-terminal border border-terminal-dim rounded">
        <Story />
      </div>
    ),
  ],
}

export const LongNames: Story = {
  args: {
    username: 'verylongusername_that_should_truncate',
    orgName: 'Very Long Organization Name That Exceeds Container Width',
    userRole: 'admin',
  },
}

export const AllRoles: Story = {
  render: () => (
    <div className="space-y-2">
      <SidebarUserInfoMock username="owner_user" orgName="Organization" userRole="owner" />
      <SidebarUserInfoMock username="admin_user" orgName="Organization" userRole="admin" />
      <SidebarUserInfoMock username="member_user" orgName="Organization" userRole="member" />
      <SidebarUserInfoMock username="viewer_user" orgName="Organization" userRole="viewer" />
    </div>
  ),
}
