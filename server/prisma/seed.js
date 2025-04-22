const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = [];

  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username().toLowerCase(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  for (const user of users) {
    for (let i = 0; i < 2; i++) {
      const post = await prisma.post.create({
        data: {
          image: faker.image.urlLoremFlickr({ category: "code" }),
          caption: faker.hacker.phrase(),
          userId: user.id,
        },
      });

      for (let j = 0; j < 2; j++) {
        const commenter = users[Math.floor(Math.random() * users.length)];
        await prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            postId: post.id,
            userId: commenter.id,
          },
        });
      }
    }
  }

  for (const user of users) {
    const others = users.filter((u) => u.id !== user.id);
    for (let i = 0; i < 2; i++) {
      const friend = others[Math.floor(Math.random() * others.length)];
      await prisma.friend.create({
        data: {
          userId: friend.id,
          addedById: user.id,
        },
      });
    }
  }

  const allPosts = await prisma.post.findMany();
  for (const post of allPosts) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.like.create({
      data: {
        userId: randomUser.id,
        postId: post.id,
      },
    });
  }

  const allComments = await prisma.comment.findMany();
  for (const comment of allComments) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.like.create({
      data: {
        userId: randomUser.id,
        commentId: comment.id,
      },
    });
  }
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
