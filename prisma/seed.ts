import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

async function seedNews() {
  try {
    const filePath = path.join(__dirname, 'seed', 'noticias.json');
    const noticias = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const newsData = noticias.map((noticia: any) => ({
      id: noticia.id,
      section: noticia.editoria,
      url: noticia.url,
      title: noticia.titulo,
      subtitle: noticia.subtitulo,
      publicationDateTime: new Date(noticia.data_hora_publicacao),
      image: noticia.imagem,
      imageThumb: noticia.imagem_thumb,
      content: noticia.conteudo,
      createdAt: new Date(noticia.data_hora_publicacao),
      updatedAt: new Date(noticia.data_hora_publicacao),
    }));

    for (const news of newsData) {
      await prisma.news.upsert({
        where: { id: news.id },
        update: news,
        create: news,
      });
    }

    console.log('Table News populated successfully!');
  } catch (error) {
    console.error('Error when populating the News table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNews();