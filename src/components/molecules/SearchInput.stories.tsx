import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { SearchInput, CompactSearchInput } from './SearchInput'

const meta = {
  title: 'Shared/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

// Demo with state and search results
function SearchInputDemo({ debounceMs = 0 }: { debounceMs?: number }) {
  const [value, setValue] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [searchCount, setSearchCount] = useState(0)

  const handleSearch = (query: string) => {
    setSearchCount((c) => c + 1)
    // Simulate search results
    if (query) {
      const mockResults = [
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ]
      setSearchResults(mockResults)
    } else {
      setSearchResults([])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <Box variant="default" padding="sm" className="mb-4 typo-ui text-terminal-green">
        &gt; SEARCH INPUT DEMO
      </Box>

      <SearchInput
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        placeholder="> TYPE TO SEARCH..."
        debounceMs={debounceMs}
      />

      <Box variant="subtle" padding="md" className="mt-6 space-y-3">
        <div className="typo-ui text-terminal-green">&gt; Search Info:</div>
        <div className="typo-ui text-terminal-dim space-y-1">
          <div>Current value: "{value}"</div>
          <div>Search triggered: {searchCount} times</div>
          <div>Debounce: {debounceMs}ms</div>
        </div>

        {searchResults.length > 0 && (
          <>
            <div className="typo-ui text-terminal-green mt-4">&gt; Results:</div>
            <div className="space-y-1">
              {searchResults.map((result, i) => (
                <div key={i} className="typo-ui text-terminal-dim">
                  [{i + 1}] {result}
                </div>
              ))}
            </div>
          </>
        )}
      </Box>
    </div>
  )
}

export const Default: Story = {
  render: () => <SearchInputDemo />,
}

export const WithDebounce: Story = {
  render: () => <SearchInputDemo debounceMs={500} />,
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('initial value')

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <SearchInput value={value} onChange={setValue} />
        <Box variant="subtle" padding="sm" className="mt-4 typo-ui text-terminal-dim">
          Controlled value: "{value}"
        </Box>
      </div>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => {
    const [lastSearch, setLastSearch] = useState('')

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <SearchInput onSearch={setLastSearch} placeholder="> UNCONTROLLED SEARCH..." />
        <Box variant="subtle" padding="sm" className="mt-4 typo-ui text-terminal-dim">
          Last search: "{lastSearch}"
        </Box>
      </div>
    )
  },
}

export const WithCustomPlaceholder: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="space-y-4">
        <SearchInput placeholder="> FIND TRIGGERS..." />
        <SearchInput placeholder="> SEARCH AGENTS..." />
        <SearchInput placeholder="> FILTER EVENTS..." />
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <SearchInput value="Cannot edit this" disabled placeholder="> DISABLED..." />
    </div>
  ),
}

export const WithoutClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('some search query')

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <SearchInput value={value} onChange={setValue} showClearButton={false} />
      </div>
    )
  },
}

export const AutoFocus: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <Box variant="subtle" padding="sm" className="mb-4 typo-ui text-terminal-dim">
        The input below should be auto-focused
      </Box>
      <SearchInput autoFocus placeholder="> AUTO-FOCUSED INPUT..." />
    </div>
  ),
}

export const CompactVariant: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<string[]>([])

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <Box variant="default" padding="sm" className="mb-4 typo-ui text-terminal-green">
          &gt; COMPACT SEARCH (Press Enter to submit)
        </Box>

        <CompactSearchInput
          onSubmit={(value) => setSubmitted([value, ...submitted])}
          placeholder="> PRESS ENTER TO SEARCH..."
        />

        {submitted.length > 0 && (
          <Box variant="subtle" padding="md" className="mt-6">
            <div className="typo-ui text-terminal-green mb-2">&gt; Submitted searches:</div>
            <div className="space-y-1">
              {submitted.map((search, i) => (
                <div key={i} className="typo-ui text-terminal-dim">
                  [{i + 1}] "{search}"
                </div>
              ))}
            </div>
          </Box>
        )}
      </div>
    )
  },
}

export const InFilterBar: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [results] = useState(42)

    return (
      <div className="max-w-4xl mx-auto p-8 bg-background">
        <Box variant="default" padding="md">
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="> SEARCH TRIGGERS..."
              debounceMs={300}
            />
          </div>

          <div className="typo-ui text-terminal-dim pt-4 border-t border-terminal-dim">
            &gt; SHOWING {results} RESULTS
          </div>
        </Box>
      </div>
    )
  },
}

export const KeyboardShortcuts: Story = {
  render: () => {
    const [searches, setSearches] = useState<string[]>([])

    return (
      <div className="max-w-2xl mx-auto p-8 bg-background">
        <Box variant="subtle" padding="sm" className="mb-4 typo-ui text-terminal-dim space-y-1">
          <div>• Press <kbd className="text-terminal-bright">Enter</kbd> to search</div>
          <div>• Press <kbd className="text-terminal-bright">Escape</kbd> to clear</div>
        </Box>

        <SearchInput
          onSearch={(value) => value && setSearches([value, ...searches.slice(0, 4)])}
          placeholder="> TRY KEYBOARD SHORTCUTS..."
        />

        {searches.length > 0 && (
          <Box variant="subtle" padding="sm" className="mt-4">
            <div className="typo-ui text-terminal-green mb-2">&gt; Search history:</div>
            {searches.map((s, i) => (
              <div key={i} className="typo-ui text-terminal-dim">
                [{i + 1}] {s}
              </div>
            ))}
          </Box>
        )}
      </div>
    )
  },
}
