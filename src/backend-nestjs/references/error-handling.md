# Backend Error Handling

Use NestJS built-in exceptions; never invent ad-hoc error shapes, never swallow errors.

| Situation | Exception |
|-----------|-----------|
| Entity not found | `NotFoundException` |
| Insufficient permissions | `ForbiddenException` |
| Invalid input / state | `BadRequestException` |
| Duplicate resource | `ConflictException` |
| Not authenticated | `UnauthorizedException` |

```typescript
if (!report) throw new NotFoundException(`Report ${id} not found`);
if (report.ownerId !== userId) throw new ForbiddenException('Access denied');
if (report.status !== 'DRAFT') throw new BadRequestException('Only drafts can be edited');
const existing = await this.repo.findByCode(dto.code);
if (existing) throw new ConflictException(`Code ${dto.code} already exists`);
```

Rules:
- Throw early; let NestJS exception filters format the response.
- Messages are specific and safe (no secrets, no internal stack detail).
- Don't catch an exception just to rethrow the same thing.
- Unexpected/unhandled errors surface as 500 via the global filter — don't mask them.
