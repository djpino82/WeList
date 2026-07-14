-- CreateEnum
CREATE TYPE "RolColaborador" AS ENUM ('PROPIETARIO', 'EDITOR', 'LECTOR');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "eliminado_en" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "propietario_id" TEXT NOT NULL,

    CONSTRAINT "listas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elementos" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lista_id" TEXT NOT NULL,

    CONSTRAINT "elementos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaboradores_lista" (
    "id" TEXT NOT NULL,
    "rol" "RolColaborador" NOT NULL DEFAULT 'LECTOR',
    "usuario_id" TEXT NOT NULL,
    "lista_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colaboradores_lista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitaciones" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "RolColaborador" NOT NULL DEFAULT 'EDITOR',
    "aceptada" BOOLEAN NOT NULL DEFAULT false,
    "pendiente" BOOLEAN NOT NULL DEFAULT true,
    "expiracion" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emisor_id" TEXT NOT NULL,
    "receptor_id" TEXT,
    "lista_id" TEXT NOT NULL,

    CONSTRAINT "invitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "listas_propietario_id_idx" ON "listas"("propietario_id");

-- CreateIndex
CREATE INDEX "elementos_lista_id_idx" ON "elementos"("lista_id");

-- CreateIndex
CREATE INDEX "colaboradores_lista_lista_id_idx" ON "colaboradores_lista"("lista_id");

-- CreateIndex
CREATE INDEX "colaboradores_lista_usuario_id_idx" ON "colaboradores_lista"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_lista_usuario_id_lista_id_key" ON "colaboradores_lista"("usuario_id", "lista_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitaciones_token_key" ON "invitaciones"("token");

-- CreateIndex
CREATE INDEX "invitaciones_token_idx" ON "invitaciones"("token");

-- CreateIndex
CREATE INDEX "invitaciones_email_idx" ON "invitaciones"("email");

-- CreateIndex
CREATE INDEX "invitaciones_lista_id_idx" ON "invitaciones"("lista_id");

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_propietario_id_fkey" FOREIGN KEY ("propietario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elementos" ADD CONSTRAINT "elementos_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores_lista" ADD CONSTRAINT "colaboradores_lista_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores_lista" ADD CONSTRAINT "colaboradores_lista_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitaciones" ADD CONSTRAINT "invitaciones_emisor_id_fkey" FOREIGN KEY ("emisor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitaciones" ADD CONSTRAINT "invitaciones_receptor_id_fkey" FOREIGN KEY ("receptor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitaciones" ADD CONSTRAINT "invitaciones_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
