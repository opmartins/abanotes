import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador padrão
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abanotes.com' },
    update: {},
    create: {
      email: 'admin@abanotes.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN'
    },
  });

  console.log('✅ Usuário administrador criado:', admin.email);

  // Criar usuário comum de exemplo
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'usuario@abanotes.com' },
    update: {},
    create: {
      email: 'usuario@abanotes.com',
      name: 'Usuário Exemplo',
      password: userPassword,
      role: 'USER'
    },
  });

  console.log('✅ Usuário exemplo criado:', user.email);

  // Sample records
  await prisma.record.createMany({
    data: [
      { title: 'Anamnese Inicial', description: 'Primeira avaliação do paciente', userId: admin.id },
      { title: 'Sessão 1', description: 'Intervenção ABA – reforço diferencial', userId: user.id },
    ],
    skipDuplicates: true,
  });

  // Sample reports
  await prisma.report.createMany({
    data: [
      { title: 'Relatório Mensal', content: 'Evolução positiva em comunicação funcional', userId: admin.id },
      { title: 'Plano de Intervenção', content: 'Metas: comunicação, habilidades sociais, autonomia', userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log('\n📋 Credenciais de acesso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 ADMINISTRADOR');
  console.log('   Email: admin@abanotes.com');
  console.log('   Senha: admin123');
  console.log('');
  console.log('👤 USUÁRIO');
  console.log('   Email: usuario@abanotes.com');
  console.log('   Senha: user123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
