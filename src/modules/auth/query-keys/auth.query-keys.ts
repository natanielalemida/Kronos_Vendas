export const authQueryKeys = {
  all: ['auth'] as const,
  organizations: () => [...authQueryKeys.all, 'organizations'] as const,
  organizationSummaries: (activeConnectionId?: number) =>
    [
      ...authQueryKeys.organizations(),
      'summaries',
      activeConnectionId,
    ] as const,
};
