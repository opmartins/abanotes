import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Default user
  const email = 'admin@clinica.local';
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Administrador',
      email,
      password: passwordHash,
    },
  });

  // Sample records
  await prisma.record.createMany({
    data: [
      { title: 'Anamnese Inicial', description: 'Primeira avaliação do paciente', userId: user.id },
      { title: 'Sessão 1', description: 'Intervenção ABA – reforço diferencial', userId: user.id },
    ],
    skipDuplicates: true,
  });

  // Sample reports
  await prisma.report.createMany({
    data: [
      { title: 'Relatório Mensal', content: 'Evolução positiva em comunicação funcional', userId: user.id },
      { title: 'Plano de Intervenção', content: 'Metas: comunicação, habilidades sociais, autonomia', userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed concluído. Usuário padrão:', email, 'senha:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
