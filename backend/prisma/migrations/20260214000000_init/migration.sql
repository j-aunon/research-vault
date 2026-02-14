CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "ResourceType" AS ENUM ('paper', 'book', 'website');

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "color" VARCHAR(50) DEFAULT 'bg-blue-500',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "folders" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "color" VARCHAR(50) DEFAULT 'bg-purple-500',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "resources" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "project_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "folder_id" UUID REFERENCES "folders"("id") ON DELETE SET NULL,
  "title" VARCHAR(500) NOT NULL,
  "type" "ResourceType" NOT NULL,
  "url" TEXT,
  "notes" TEXT,
  "starred" BOOLEAN DEFAULT FALSE,
  "added_date" TIMESTAMP DEFAULT NOW(),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "idx_resources_project" ON "resources"("project_id");
CREATE INDEX "idx_resources_folder" ON "resources"("folder_id");
CREATE INDEX "idx_resources_type" ON "resources"("type");
CREATE INDEX "idx_resources_starred" ON "resources"("starred");

CREATE TABLE "tags" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  UNIQUE("user_id", "name")
);

CREATE INDEX "idx_tags_user" ON "tags"("user_id");

CREATE TABLE "resource_tags" (
  "resource_id" UUID NOT NULL REFERENCES "resources"("id") ON DELETE CASCADE,
  "tag_id" UUID NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("resource_id", "tag_id")
);

CREATE INDEX "idx_resource_tags_resource" ON "resource_tags"("resource_id");
CREATE INDEX "idx_resource_tags_tag" ON "resource_tags"("tag_id");
