-- CreateTable
CREATE TABLE "t_focus" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "focus_img" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_focus_pkey" PRIMARY KEY ("id")
);
