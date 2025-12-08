import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Box } from '@/components/atoms/box'
import { CodeBlock, InlineCode } from './CodeBlock'

const meta = {
  title: 'Shared/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof CodeBlock>

const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`
}

const message = greet("World")
console.log(message)`

const jsonSample = `{
  "name": "High Reputation Alert",
  "chainId": 1,
  "registry": "reputation",
  "conditions": [
    {
      "field": "reputation_score",
      "operator": "gt",
      "value": "800"
    }
  ]
}`

export const Default: Story = {
  args: {
    code: sampleCode,
  },
}

export const WithLanguage: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
  },
}

export const WithLineNumbers: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    showLineNumbers: true,
  },
}

export const WithTitle: Story = {
  args: {
    code: jsonSample,
    language: 'json',
    title: 'Trigger Configuration',
    showLineNumbers: true,
  },
}

export const WithMaxHeight: Story = {
  args: {
    code: Array.from({ length: 30 }, (_, i) => `Line ${i + 1}: const value = ${i * 10};`).join('\n'),
    language: 'typescript',
    maxHeight: '200px',
    showLineNumbers: true,
  },
}

export const NotCopyable: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    copyable: false,
  },
}

export const InlineCodeExample: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-8 bg-background">
      <div className="typo-ui text-terminal-dim space-y-4">
        <p>
          Use the <InlineCode>npm install</InlineCode> command to install dependencies.
        </p>
        <p>
          The <InlineCode>chainId</InlineCode> parameter must be a valid chain identifier.
        </p>
        <p>
          Set <InlineCode>enabled: true</InlineCode> to activate the trigger.
        </p>
      </div>
    </div>
  ),
}

export const Documentation: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 bg-background space-y-6">
      <Box variant="default" padding="md" className="typo-ui text-terminal-green">
        &gt; CODE EXAMPLES
      </Box>

      <div>
        <h3 className="typo-ui text-terminal-bright mb-2">Example 1: Create Trigger</h3>
        <CodeBlock
          code={jsonSample}
          language="json"
          title="Request Body"
          showLineNumbers
        />
      </div>

      <div>
        <h3 className="typo-ui text-terminal-bright mb-2">Example 2: TypeScript</h3>
        <CodeBlock
          code={sampleCode}
          language="typescript"
          showLineNumbers
        />
      </div>
    </div>
  ),
}
