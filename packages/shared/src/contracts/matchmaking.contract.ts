import type { CpuOpponentKey, LiveMatchMode } from './common.contract';
import type { LiveMatchEventContract, LiveMatchSessionContract } from './live-match.contract';

// ---------------------------------------------------------------------------
// Matchmaking / Pre-Match contract
// ---------------------------------------------------------------------------
//
// These shapes describe the room-start boundary before Live Match owns active
// combat truth.

export type MatchRoomMode = LiveMatchMode;

export type MatchRoomStatus =
  | 'created'
  | 'queueing'
  | 'waiting_ready'
  | 'countdown'
  | 'live'
  | 'cancelled';

export type MatchmakingEventName =
  | 'room.created'
  | 'room.assigned'
  | 'room.cancelled'
  | 'prematch.cancelled'
  | 'room.full'
  | 'queue.joined'
  | 'queue.cancelled'
  | 'ready.state'
  | 'match.countdown'
  | 'match.started';

export interface ReadyStateContract {
  p1Ready: boolean;
  p2Ready: boolean;
  readyWindowEndsAtMs?: number;
}

export interface CountdownStateContract {
  startedAtMs: number;
  endsAtMs: number;
}

export interface MatchRoomContract {
  roomId: string;
  matchId: string;
  mode: MatchRoomMode;
  status: MatchRoomStatus;
  createdAtMs: number;
  updatedAtMs: number;
  isPrivateMatch: boolean;
  playerIds: readonly string[];
  cpuOpponentKey?: CpuOpponentKey;
  readyState?: ReadyStateContract;
  countdownState?: CountdownStateContract;
  liveMatchStartedAtMs?: number;
  cancelledReason?: string;
}

export interface MatchmakingEventContract {
  name: MatchmakingEventName;
  roomId?: string;
  matchId?: string;
  serverTimestampMs: number;
  payload: Record<string, unknown>;
}

export interface PvcStartAction {
  action: 'pvc.start';
  playerId: string;
  cpuOpponentKey: CpuOpponentKey;
}

export interface QueueJoinAction {
  action: 'queue.join';
  playerId: string;
}

export interface QueueCancelAction {
  action: 'queue.cancel';
  playerId: string;
}

export interface QueueJoinResultContract {
  room: MatchRoomContract;
  matched: boolean;
  nextRequiredStep: 'wait_for_opponent' | 'ready_flow';
}

export interface QueueCancelResultContract {
  room: MatchRoomContract;
  removedFromQueue: boolean;
}

export interface PrivateInviteSendAction {
  action: 'private_invite.send';
  inviterPlayerId: string;
  invitedPlayerId: string;
}

export interface PrivateInviteRespondAction {
  action: 'private_invite.respond';
  inviteId: string;
  playerId: string;
  response: 'accept' | 'decline';
}

export interface ReadySetAction {
  action: 'ready.set';
  roomId: string;
  playerId: string;
}

export interface ReadyStopAction {
  action: 'ready.stop';
  roomId: string;
  playerId: string;
}

export interface MatchLeavePreMatchAction {
  action: 'match.leave_prematch';
  roomId: string;
  playerId: string;
}

export interface PvcStartResultContract {
  room: MatchRoomContract;
  liveMatchSession: LiveMatchSessionContract;
  matchmakingEvents: readonly MatchmakingEventContract[];
  liveMatchEvents: readonly LiveMatchEventContract[];
}

export interface CreatePvpRoomDraftAction {
  action: 'pvp.room_draft.create';
  p1PlayerId: string;
  p2PlayerId?: string;
  isPrivateMatch?: boolean;
}

export interface PvpRoomDraftResultContract {
  room: MatchRoomContract;
  nextRequiredStep: 'wait_for_opponent' | 'ready_flow_pending';
}

export type MatchmakingClientAction =
  | PvcStartAction
  | QueueJoinAction
  | QueueCancelAction
  | PrivateInviteSendAction
  | PrivateInviteRespondAction
  | ReadySetAction
  | ReadyStopAction
  | MatchLeavePreMatchAction
  | CreatePvpRoomDraftAction;
