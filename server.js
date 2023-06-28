import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
import koaBody from 'koa-body';
import { faker } from '@faker-js/faker';
faker.locale = 'en';

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let posts = [
  {
    username: 'Toni Shanahan',
    avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/129.jpg',
    id: 'JZSPV1_3st',
    content: 'Sit voluptatum non iusto voluptatem atque ea.',
    created: 1636501383810,
    status: 'admin'
  },
  {
    username: 'Donnie Murray',
    avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1013.jpg',
    id: 'LuCE9tPsEY',
    content: 'Magni dolores laudantium ut et ratione pariatur magni.',
    created: 1650971793208,
    status: 'user',
  },
  {
    username: 'Ray Lowe',
    avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1026.jpg',
    id: '1FD-Mt36Y2',
    content: 'Enim vel nam dolores nostrum quia ducimus ipsum ex aut.',
    created: 1630792341535,
    status: 'user'
  }
];

const router = new Router();

router.get('/posts', async (ctx, next) => {
  ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
  const { id, content } = ctx.request.body;
  const idx = posts.findIndex((post) => post.id === id);
  if (idx === -1) {
    posts.push({
      ...ctx.request.body,
      created: Date.now(),
      username: faker.name.findName(),
      status: 'user',
      avatar: faker.image.avatar()
    });
  } else {
    posts[idx] = {...ctx.request.body, content, created: Date.now()}
  }
  ctx.response.status = 204;
});

router.delete('/posts/:id', async (ctx, next) => {
  const postId = ctx.params.id;
  const index = posts.findIndex(o => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = 'Сервер работает';
})

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log(`The server started on port ${port}`));

export default server;