'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, type DeveloperStats } from '@/lib/api';
import { useDashboardUser } from '@/context/DashboardContext';
import { Avatar, Badge, Button, Card, Notice, PageLoader, SectionTitle } from '@/components/ui';

function duration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m ${Math.floor(seconds % 60)}s`;
}
function date(value: string | null) { return value ? new Date(value).toLocaleString() : 'Never'; }

export default function DeveloperDashboard() {
  const user = useDashboardUser();
  const [data, setData] = useState<DeveloperStats | null>(null);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deletedMessage, setDeletedMessage] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    if (user.role !== 'developer') return;
    let cancelled = false;
    setBusy(true); setError('');
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function load() {
      try {
        const result = await api.developerUsers(page, search);
        if (!cancelled) { setData(result); setError(''); }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load players.');
      } finally {
        if (!cancelled) { setBusy(false); timer = setTimeout(load, 10000); }
      }
    }
    void load();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [user.role, page, search, refresh]);
  async function removeAccount(id: string, username: string) {
    if (!window.confirm(`Permanently delete ${username}? This removes their account, stats and friendships. This cannot be undone.`)) return;
    setDeleting(id); setDeleteError(''); setDeletedMessage('');
    try {
      await api.deleteDeveloperUser(id, username);
      setExpanded(null);
      setDeletedMessage(`${username}'s account was deleted.`);
      if (data?.rows.length === 1 && page > 1) setPage(p => p - 1);
      else setRefresh(v => v + 1);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete this account.');
    } finally { setDeleting(null); }
  }
  if (user.role !== 'developer') return <Notice kind="error">Developer access required. <Link href="/dashboard">Return to game</Link></Notice>;
  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><Badge>DEVELOPER ACCESS</Badge><SectionTitle title="Player observatory" subtitle="Your community, progress and time in the arena." /></div>
      <Link href="/dashboard"><Button variant="ghost">← Play the game</Button></Link>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['Registered players', data?.totalUsers.toLocaleString()], ['Recorded match entries', data?.recordedParticipations.toLocaleString()], ['Total player time', data ? duration(data.totalPlaySeconds) : undefined]].map(([label,value]) =>
        <Card key={label} className="p-6"><p className="text-sm" style={{color:'var(--sf-muted)'}}>{label}</p><p className="mt-2 text-3xl font-bold" style={{color:'var(--sf-emerald)'}}>{value ?? '—'}</p></Card>)}
    </div>
    <Card className="p-5 text-sm" style={{color:'var(--sf-muted)'}}>
      Play time counts finished or voided matches, including any pauses. Live and abandoned CPU matches are excluded.
      Historical PvP time is included; CPU durations and answer accuracy begin with this update. CPU win counts include earlier games.
      A PvP match creates one entry for each player.
    </Card>
    <Card className="overflow-hidden p-5">
      <form className="mb-5 flex flex-wrap gap-3" onSubmit={e => {e.preventDefault();setPage(1);setSearch(draft.trim());}}>
        <input className="sf-underline min-w-0 flex-1" aria-label="Search players" placeholder="Search username or email…" maxLength={100} value={draft} onChange={e=>setDraft(e.target.value)} />
        <Button type="submit" disabled={busy}>Search</Button>
        <Button type="button" variant="ghost" disabled={busy} onClick={()=>setRefresh(v=>v+1)}>Refresh</Button>
      </form>
      {deleteError && <Notice kind="error">{deleteError}</Notice>}
      {deletedMessage && <p role="status" className="mb-3 text-sm">{deletedMessage}</p>}
      {error && <Notice kind="error">{error}</Notice>}
      {busy ? <PageLoader /> : data && !error && <>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{borderCollapse:'collapse',minWidth:900}}>
            <caption className="pb-4 text-left" style={{color:'var(--sf-muted)'}}>{data.total} matching players · status refreshes every 10 seconds · select a player for details</caption>
            <thead><tr style={{color:'var(--sf-muted)',borderBottom:'1px solid var(--sf-faint)'}}>
              {['Player','Connection','Aura','Matches','Wins / losses','Accuracy','Play time','Last login','Account'].map(h=><th key={h} className="px-3 py-3 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>{data.rows.map(row=><tr key={row.id} style={{borderBottom:'1px solid rgba(160,160,180,.15)'}}>
              <td className="px-3 py-4"><div className="flex items-center gap-3"><Avatar identity={row} size={40} className="shrink-0" /><div><button type="button" className="text-left font-bold underline underline-offset-4" style={{color:'var(--sf-sky)'}} onClick={()=>setExpanded(expanded===row.id?null:row.id)} aria-expanded={expanded===row.id}>{row.username}</button><div className="mt-1 text-xs" style={{color:'var(--sf-muted)'}}>{row.role} · {row.status}</div></div></div>
                {expanded===row.id && <div className="mt-3 flex flex-col gap-2 text-xs" style={{color:'var(--sf-muted)',maxWidth:280,overflowWrap:'anywhere'}}>
                  <span>{row.email}</span><span>Joined: {date(row.createdAt)}</span><span>Last activity: {date(row.lastActiveAt)}</span>
                  <span>Tutorial: {row.tutorialCompleted?'Completed':'Not completed'}</span>
                  <span>CPU wins: 🤏🏻 {row.cpuWins.min??0} · 👊 {row.cpuWins.max??0} · 🛡️ {row.cpuWins.shi_eld??0} · 🔥 {row.cpuWins.fury??0}</span>
                  <span>Recorded: {row.cpuMatches} CPU · {row.pvpMatches} PvP</span>
                  <span>{row.draws} draws · {row.voided} voided</span><span>Answers: {row.correctAnswers} correct / {row.submittedAttempts} attempts</span>
                </div>}
              </td>
              <td className="whitespace-nowrap px-3 py-4"><span className="inline-flex items-center gap-2">
                <span aria-hidden="true" style={{width:10,height:10,borderRadius:'50%',backgroundColor:row.online?'#4ade80':'#f87171',flexShrink:0}} />
                {row.online ? 'Online' : 'Offline'}
              </span></td>
              <td className="px-3 py-4">{row.aura}</td><td className="px-3 py-4">{row.recordedMatches}</td>
              <td className="px-3 py-4"><span style={{color:'var(--sf-emerald)'}}>{row.wins}</span> / {row.losses}</td>
              <td className="px-3 py-4">{row.accuracy===null?'—':`${Math.round(row.accuracy*100)}%`}</td>
              <td className="whitespace-nowrap px-3 py-4">{duration(row.playSeconds)}</td><td className="px-3 py-4">{date(row.lastLoginAt)}</td>
              <td className="px-3 py-4">
                {row.role === 'developer' || row.username === 'skyforge' || row.id === user.id
                  ? <span className="text-xs" style={{color:'var(--sf-muted)'}}>Protected</span>
                  : <button type="button" disabled={deleting !== null} aria-label={`Delete account ${row.username}`}
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50" style={{color:'#f87171',borderColor:'#f87171'}}
                      onClick={() => void removeAccount(row.id, row.username)}>{deleting === row.id ? 'Deleting…' : 'Delete account'}</button>}
              </td>
            </tr>)}</tbody>
          </table>
          {data.rows.length===0 && <p className="py-8 text-center">No players match your search.</p>}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="ghost" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button>
          <span className="text-sm">Page {page} of {Math.max(1,Math.ceil(data.total/data.pageSize))}</span>
          <Button variant="ghost" disabled={page*data.pageSize>=data.total} onClick={()=>setPage(p=>p+1)}>Next</Button>
        </div>
      </>}
    </Card>
  </div>;
}
