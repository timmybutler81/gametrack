-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PLAYING', 'BACKLOG', 'COMPLETED', 'ON_HOLD', 'DROPPED');

-- CreateEnum
CREATE TYPE "PlaythroughStatus" AS ENUM ('PLAYING', 'COMPLETED', 'ON_HOLD', 'DROPPED');

-- CreateTable
CREATE TABLE "games" (
    "id" BIGSERIAL NOT NULL,
    "rawg_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "developer" TEXT,
    "image_url" TEXT,
    "release_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_games" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "game_id" BIGINT NOT NULL,
    "genre" TEXT,
    "status" "GameStatus" NOT NULL,
    "date_added" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_game_platforms" (
    "id" BIGSERIAL NOT NULL,
    "user_game_id" BIGINT NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_game_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playthroughs" (
    "id" BIGSERIAL NOT NULL,
    "user_game_id" BIGINT NOT NULL,
    "platform" TEXT NOT NULL,
    "playthrough_number" INTEGER NOT NULL,
    "status" "PlaythroughStatus" NOT NULL,
    "date_started" DATE,
    "date_ended" DATE,
    "hours_played" DECIMAL(7,2),
    "rating" INTEGER,
    "achievements_supported" BOOLEAN NOT NULL DEFAULT false,
    "achievements_completed" INTEGER NOT NULL DEFAULT 0,
    "achievements_total" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playthroughs_pkey" PRIMARY KEY ("id"),

    CONSTRAINT "playthroughs_playthrough_number_check" CHECK ("playthrough_number" > 0),

    CONSTRAINT "playthroughs_hours_played_check" CHECK ("hours_played" IS NULL OR "hours_played" >= 0),

    CONSTRAINT "playthroughs_rating_check" CHECK ("rating" IS NULL OR "rating" BETWEEN 1 AND 5),

    CONSTRAINT "playthroughs_achievements_completed_check" CHECK ("achievements_completed" >= 0),

    CONSTRAINT "playthroughs_achievements_total_check" CHECK ("achievements_total" >= 0),

    CONSTRAINT "playthroughs_achievements_count_check" CHECK ("achievements_completed" <= "achievements_total")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "default_platform" TEXT,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "private_profile" BOOLEAN NOT NULL DEFAULT false,
    "show_gaming_activity" BOOLEAN NOT NULL DEFAULT true,
    "achievement_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_rawg_id_key" ON "games"("rawg_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_games_user_id_game_id_key" ON "user_games"("user_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_game_platforms_user_game_id_platform_key" ON "user_game_platforms"("user_game_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "playthroughs_user_game_id_playthrough_number_key" ON "playthroughs"("user_game_id", "playthrough_number");

-- AddForeignKey
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_game_platforms" ADD CONSTRAINT "user_game_platforms_user_game_id_fkey" FOREIGN KEY ("user_game_id") REFERENCES "user_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playthroughs" ADD CONSTRAINT "playthroughs_user_game_id_fkey" FOREIGN KEY ("user_game_id") REFERENCES "user_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playthroughs" ADD CONSTRAINT "playthroughs_user_game_id_platform_fkey" FOREIGN KEY ("user_game_id", "platform") REFERENCES "user_game_platforms"("user_game_id", "platform") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
