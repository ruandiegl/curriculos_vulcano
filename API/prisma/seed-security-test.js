import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const email = 'legacy.security-test@example.invalid';

async function main() {
  const user = await prisma.usuario.upsert({
    where: { email },
    update: {
      nome: 'Usuario Legado de Teste',
      passHash: null,
      cpf: '99999999999',
      tipo: 'usuario',
      firebaseUid: `security-test:${email}`,
    },
    create: {
      firebaseUid: `security-test:${email}`,
      nome: 'Usuario Legado de Teste',
      email,
      cpf: '99999999999',
      tipo: 'usuario',
      passHash: null,
      possuiCurriculo: false,
    },
  });

  console.log(`Usuario legado de teste pronto: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
