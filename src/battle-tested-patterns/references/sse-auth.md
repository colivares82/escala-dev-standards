# Authenticated SSE (Server-Sent Events)

## The trap
The browser's native `EventSource` cannot send custom headers, so it can't carry
`Authorization: Bearer <token>`. Don't try to auth SSE via `EventSource`.

## The pattern: fetch + ReadableStream
Open the stream with `fetch` (which can send headers) and parse the `text/event-stream`
manually.

```typescript
const res = await fetch(`${api.base}/api/sse`, {
  headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
});
const reader = res.body!.getReader();
const decoder = new TextDecoder();
let buf = '';
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  const events = buf.split('\n\n');
  buf = events.pop() ?? '';
  for (const ev of events) {
    const data = ev.split('\n').find(l => l.startsWith('data:'))?.slice(5).trim();
    if (data) handle(JSON.parse(data));
  }
}
```

## Server side (NestJS + RxJS)
- A `@Global()` notifications module exposes a `NotificationsService` injectable anywhere.
- One **RxJS `Subject` per connection**, kept in a `Map<userId, Subject[]>` for multi-device.
- Push by `next()`-ing the user's subjects; clean up on disconnect.
- Triggers are domain events (item finalized → admins, approved → owner, etc.).
