ALTER TABLE "users" ADD COLUMN "role" VARCHAR(16) NOT NULL DEFAULT 'player';
CREATE TABLE "player_match_records" (
 "match_id" TEXT NOT NULL, "user_id" TEXT NOT NULL,
 "mode" VARCHAR(8) NOT NULL, "result" VARCHAR(16) NOT NULL,
 "started_at" TIMESTAMP(3) NOT NULL, "ended_at" TIMESTAMP(3) NOT NULL,
 "duration_seconds" INTEGER NOT NULL CHECK ("duration_seconds" >= 0),
 "correct_answers" INTEGER, "submitted_attempts" INTEGER,
 PRIMARY KEY ("match_id", "user_id"),
 FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "player_match_records_user_id_ended_at_idx" ON "player_match_records"("user_id", "ended_at");
-- Recover historical PvP duration. Old answer counts and CPU durations were not stored.
INSERT INTO "player_match_records" (match_id,user_id,mode,result,started_at,ended_at,duration_seconds)
SELECT m.match_id, p.user_id, 'pvp',
 CASE WHEN m.status = 'voided' THEN 'voided' WHEN m.winner_player_id = p.user_id THEN 'win'
 WHEN m.winner_player_id IS NULL THEN 'draw' ELSE 'loss' END,
 m.started_at,m.ended_at,GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (m.ended_at-m.started_at))))::integer
FROM pvp_matches m CROSS JOIN LATERAL (VALUES (m.p1_player_id),(m.p2_player_id)) p(user_id)
JOIN users u ON u.id=p.user_id WHERE m.ended_at IS NOT NULL
ON CONFLICT DO NOTHING;
