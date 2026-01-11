/**
 * CreateOrganizationDialog
 *
 * A dialog for creating new organizations with name, slug, and description.
 * Auto-generates slug from name and switches to the new organization on success.
 *
 * @module components/organisms/CreateOrganizationDialog
 *
 * @example
 * ```tsx
 * <CreateOrganizationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSuccess={(org) => console.log('Created:', org.name)}
 * />
 * ```
 */
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/atoms'
import { useCreateOrganization, useSwitchOrganization } from '@/hooks'
import {
  createOrganizationRequestSchema,
  type CreateOrganizationRequest,
  type Organization,
} from '@/lib/validations'

/**
 * Props for the CreateOrganizationDialog component.
 */
interface CreateOrganizationDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback to control dialog open state */
  onOpenChange: (open: boolean) => void
  /** Callback when organization is successfully created */
  onSuccess?: (org: Organization) => void
}

/**
 * Generates a URL-friendly slug from an organization name.
 * @param name - The organization name to convert
 * @returns A lowercase, hyphenated slug
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateOrganizationDialogProps) {
  const createOrg = useCreateOrganization()
  const switchOrg = useSwitchOrganization()
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(createOrganizationRequestSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  })

  const watchedName = form.watch('name')

  // Auto-generate slug from name (unless user manually edited it)
  useEffect(() => {
    if (watchedName && !slugManuallyEdited) {
      const slug = generateSlug(watchedName)
      form.setValue('slug', slug, { shouldValidate: false })
    }
  }, [watchedName, slugManuallyEdited, form])

  const onSubmit = async (data: CreateOrganizationRequest) => {
    try {
      const result = await createOrg.mutateAsync({
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        description: data.description || undefined,
      })

      // Switch to the new organization
      switchOrg.mutate(result.id)

      // Reset form and close dialog
      form.reset()
      setSlugManuallyEdited(false)
      onOpenChange(false)
      onSuccess?.(result)
    } catch {
      // Error handling is done by the mutation
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      setSlugManuallyEdited(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-terminal border-terminal-green sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-terminal-green glow">
            [+] CREATE ORGANIZATION
          </DialogTitle>
          <DialogDescription className="text-terminal-dim">
            Create a new organization to manage your agents and triggers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-terminal-green typo-ui">
                    &gt; NAME
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My Organization"
                      className="bg-terminal border-terminal-dim focus:border-terminal-green typo-ui"
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription className="text-terminal-dim text-xs">
                    2-100 characters
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-terminal-green typo-ui">
                    &gt; SLUG
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="my-organization"
                      className="bg-terminal border-terminal-dim focus:border-terminal-green typo-ui font-mono"
                      onChange={(e) => {
                        field.onChange(e)
                        setSlugManuallyEdited(true)
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-terminal-dim text-xs">
                    URL-friendly identifier (lowercase, hyphens allowed)
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-terminal-green typo-ui">
                    &gt; DESCRIPTION
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Optional description..."
                      className="bg-terminal border-terminal-dim focus:border-terminal-green typo-ui resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription className="text-terminal-dim text-xs">
                    Max 500 characters (optional)
                  </FormDescription>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="typo-ui"
              >
                [CANCEL]
              </Button>
              <Button
                type="submit"
                disabled={createOrg.isPending}
                className="typo-ui"
              >
                {createOrg.isPending ? '[CREATING...]' : '[CREATE]'}
              </Button>
            </DialogFooter>

            {createOrg.isError && (
              <p className="text-destructive typo-ui text-center">
                Error: {createOrg.error?.message ?? 'Failed to create organization'}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
