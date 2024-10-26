-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "senderid" INTEGER NOT NULL,
    "receiverid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
