# Backend Security & RBAC

## Guards + decorators

```typescript
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)        // always both
export class ReportsController {
  @Post()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // role restriction
  async create(@Body() dto: CreateReportDto, @CurrentUser() user: AuthUser) {
    // user: { userId, email, role, orgId? }
    return this.service.create(dto, user);
  }
}
```

- `JwtAuthGuard` validates the token and injects the user context.
- `RolesGuard` + `@Roles(...)` enforce role access.
- `@CurrentUser()` injects the authenticated principal — never trust a client-supplied user id.

## Role-based data filtering (generic matrix)

| Role tier | Sees |
|-----------|------|
| Admin | all records |
| Owner-scoped (e.g. the creator) | only records they own |
| Org-scoped (belongs to a client/provider org) | only their organization's records, and only in shareable states (e.g. approved/sent) |

Apply the filter in the **service/repository**, not the controller — pass the `user` context
down and let the query narrow `where` by role. Never filter only in the UI.

## Auth flow (reference)
1. `POST /auth/login` → JWT access token (e.g. 8h) + refresh (e.g. 30d).
2. Every request: `Authorization: Bearer <token>`.
3. `JwtAuthGuard` extracts `userId`, `role`, org ids.
4. Secrets (`JWT_SECRET`) come from `ConfigService`/Secret Manager — never hardcoded.
