-- CreateTable
CREATE TABLE "t_admin_access" (
    "id" TEXT NOT NULL,
    "access_name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "parent_id" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_admin_access_pkey" PRIMARY KEY ("id")
);
