const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribes = new Set();

router.get('/subscribe', async (ctx) => {

  const message = await new Promise(resolve => {
    subscribes.add(resolve);
  });

  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;

  if (!message) {
    ctx.throw(400, 'empty message');
  }

  for (const subscribeResolve of subscribes) {
    await subscribeResolve(ctx.request.body.message);
  }

  subscribes.clear();

  ctx.statusCode = 201;
  ctx.body = {message};

});

app.use(router.routes());

module.exports = app;
