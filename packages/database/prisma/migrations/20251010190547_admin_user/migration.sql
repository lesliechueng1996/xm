-- CreateTable
CREATE TABLE "t_admin_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "role_id" TEXT NOT NULL,
    "is_super" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_admin_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_admin_user_username_key" ON "t_admin_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "t_admin_user_mobile_key" ON "t_admin_user"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "t_admin_user_email_key" ON "t_admin_user"("email");
