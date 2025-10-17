'use client';
import useSWR from 'swr';
import { usersService, type PageResp, type User } from '@/services/user.service';

export default function UsersPage() {
  const { data, error, isLoading } = useSWR(
      ['/api/users', { page: 1, limit: 10 }],
      ([, params]) => usersService.list(params).then(r => r.data)
  );

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error</div>;

  const resp = data as PageResp<User>;
  return (
      <ul>
        {resp.data.map(u => (
            <li key={u.id}>{u.email} — {u.role}</li>
        ))}
      </ul>
  );
}
