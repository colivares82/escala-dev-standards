# Test Patterns

## Backend service (Jest + NestJS)
```typescript
describe('ExampleService', () => {
  let service: ExampleService;
  const repo = { findByCode: jest.fn(), create: jest.fn() };

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [ExampleService, { provide: ExampleRepository, useValue: repo }],
    }).compile();
    service = mod.get(ExampleService);
  });
  afterEach(() => jest.clearAllMocks());

  it('uppercases the code on create', async () => {
    repo.findByCode.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: '1', code: 'GUCCI' });
    const result = await service.create({ name: 'Gucci', code: 'gucci' });
    expect(result.code).toBe('GUCCI');
  });

  it('throws ConflictException on duplicate code', async () => {
    repo.findByCode.mockResolvedValue({ id: '1' });
    await expect(service.create({ name: 'X', code: 'GUCCI' }))
      .rejects.toThrow(ConflictException);
  });
});
```

## Frontend hook (Vitest + MSW)
```typescript
describe('useClients', () => {
  it('fetches clients on mount', async () => {
    const { result } = renderHook(() => useClients());     // MSW mocks the API
    await waitFor(() => {
      expect(result.current.clients).toHaveLength(3);
      expect(result.current.loading).toBe(false);
    });
  });
});
```

## Frontend component (Vitest + RTL)
```typescript
it('opens the create form on button click', async () => {
  const { getByRole, getByText } = render(<ClientManagement />);
  await userEvent.click(getByRole('button', { name: /nuevo/i }));
  expect(getByText('Crear Cliente')).toBeInTheDocument();
});
```

Mock the layer directly below: repositories for services, MSW for hooks/components. Never hit a
real network or DB in unit tests.
