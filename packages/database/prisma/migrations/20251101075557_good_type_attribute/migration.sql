-- CreateTable
CREATE TABLE "t_good_type_attribute" (
    "id" TEXT NOT NULL,
    "type_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "attrType" TEXT NOT NULL,
    "attrValue" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "t_good_type_attribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "t_good_type_attribute" ADD CONSTRAINT "t_good_type_attribute_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "t_good_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
