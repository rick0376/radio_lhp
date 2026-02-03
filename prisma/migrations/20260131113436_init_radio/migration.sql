-- CreateTable
CREATE TABLE "RadioStatus" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "live" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT 'Oração ao vivo',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioStatus_pkey" PRIMARY KEY ("id")
);
