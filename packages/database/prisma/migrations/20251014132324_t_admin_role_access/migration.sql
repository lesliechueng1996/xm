-- CreateTable
CREATE TABLE "t_admin_role_access" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "access_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_admin_role_access_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "t_admin_role_access" ADD CONSTRAINT "t_admin_role_access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "t_admin_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "t_admin_role_access" ADD CONSTRAINT "t_admin_role_access_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "t_admin_access"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
