import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'suporteti@vulcano.com';
  const legacyEmail = 'suporteTi@vulcano.com';
  const passHash = await bcrypt.hash('Conquistas@07', 10);
  const existing = await prisma.usuario.findUnique({ where: { email } });
  const legacy = await prisma.usuario.findUnique({ where: { email: legacyEmail } });

  if (!existing && legacy) {
    await prisma.usuario.update({
      where: { email: legacyEmail },
      data: {
        email,
        firebaseUid: `local:${email}`,
      },
    });
  }

  await prisma.usuario.upsert({
    where: { email },
    update: {
      nome: 'Suporte TI',
      tipo: 'superAdmin',
      passHash,
      firebaseUid: `local:${email}`,
    },
    create: {
      firebaseUid: `local:${email}`,
      nome: 'Suporte TI',
      email,
      tipo: 'superAdmin',
      passHash,
      possuiCurriculo: false,
    },
  });

  console.log(`Seed concluida: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
