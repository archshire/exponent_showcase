-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" VARCHAR(24) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),
    "token_version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_profiles" (
    "player_id" TEXT NOT NULL,
    "profile_picture_url" TEXT,
    "premade_avatar_key" VARCHAR(64),
    "identity_image_source" VARCHAR(16) NOT NULL DEFAULT 'premade_avatar',
    "language_code" VARCHAR(8) NOT NULL DEFAULT 'en',
    "aura_points" INTEGER NOT NULL DEFAULT 0,
    "tutorial_completed" BOOLEAN NOT NULL DEFAULT false,
    "last_active_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_profiles_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "pvp_matches" (
    "match_id" TEXT NOT NULL,
    "is_private_match" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(16) NOT NULL,
    "p1_player_id" TEXT NOT NULL,
    "p2_player_id" TEXT,
    "winner_player_id" TEXT,
    "dc_player_id" TEXT,
    "void_reason" VARCHAR(64),
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "pvp_matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "player_friendships" (
    "id" TEXT NOT NULL,
    "requester_player_id" TEXT NOT NULL,
    "receiver_player_id" TEXT NOT NULL,
    "status" VARCHAR(24) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_cpu_progression" (
    "player_id" TEXT NOT NULL,
    "cpu_key" VARCHAR(32) NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "unlocked_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_cpu_progression_pkey" PRIMARY KEY ("player_id","cpu_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "pvp_matches_p1_player_id_idx" ON "pvp_matches"("p1_player_id");

-- CreateIndex
CREATE INDEX "pvp_matches_p2_player_id_idx" ON "pvp_matches"("p2_player_id");

-- CreateIndex
CREATE INDEX "player_friendships_receiver_player_id_idx" ON "player_friendships"("receiver_player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_friendships_requester_player_id_receiver_player_id_key" ON "player_friendships"("requester_player_id", "receiver_player_id");

-- AddForeignKey
ALTER TABLE "player_profiles" ADD CONSTRAINT "player_profiles_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvp_matches" ADD CONSTRAINT "pvp_matches_p1_player_id_fkey" FOREIGN KEY ("p1_player_id") REFERENCES "player_profiles"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvp_matches" ADD CONSTRAINT "pvp_matches_p2_player_id_fkey" FOREIGN KEY ("p2_player_id") REFERENCES "player_profiles"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvp_matches" ADD CONSTRAINT "pvp_matches_winner_player_id_fkey" FOREIGN KEY ("winner_player_id") REFERENCES "player_profiles"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pvp_matches" ADD CONSTRAINT "pvp_matches_dc_player_id_fkey" FOREIGN KEY ("dc_player_id") REFERENCES "player_profiles"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_friendships" ADD CONSTRAINT "player_friendships_requester_player_id_fkey" FOREIGN KEY ("requester_player_id") REFERENCES "player_profiles"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_friendships" ADD CONSTRAINT "player_friendships_receiver_player_id_fkey" FOREIGN KEY ("receiver_player_id") REFERENCES "player_profiles"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_cpu_progression" ADD CONSTRAINT "player_cpu_progression_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player_profiles"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;
