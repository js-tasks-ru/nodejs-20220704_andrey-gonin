# Настройка локальной стратегии (Решение)
 

В [официальной документации](https://github.com/jaredhanson/passport-local#usage) мы видим, что 
конструктор стратегии принимает 2 аргумента - объект с опциями а также функцию, которая проверяет
переданные пользователем значения логина и пароля.


Стоит отметить, что любой результат должен быть возвращен из этой функции с помощью коллбека `done`. 
Важно понять и запомнить аргументы этой функции:
1. `err` - это первый аргумент, который означает, что в процессе выполнения проверки произошла 
серьезная ошибка, не связанная с логикой проверки. Например, пропало соединение с базой данных.
2. `user` - второй аргумент может содержать либо объект пользователя (если все прошло хорошо), либо
значение `false`, которое будет означать, что какие-то из проверок не пройдены.
3. `info` - это опциональный третий аргумент, в котором мы можем вернуть дополнительную информацию
о результатах проверки, например, логин или пароль неверные.

Сама логика проверки в нашем случае будет выглядеть следующим образом:
1. Попытаемся найти пользователя по `email` с помощью модели `User` и ее метода `findOne`.
2. Если пользователя нет - вернем с помощью коллбека `done` сообщение о том, что пользователь не 
найден.
3. Если пользователь найден то проверим его пароль с помощью метода `checkPassword`.
4. Если пароль неверный - вернем с помощью коллбека `done` сообщение о том, что пароль неверный.
5. Если же пользователь передал верную пару `email:password`, то передадим в коллбек `done` вторым
аргументом объект пользователя.

Для удобства работы с асинхронными метода `.findOne` и `.checkPassword` в стратегии можно 
использовать `async/await`:
```js
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false, },
  async function(email, password, done) {
    try {
      const user = await User.findOne({email});
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }
      
      const isValidPassword = await user.checkPassword(password);
      
      if (!isValidPassword) {
        return done(null, false, 'Неверный пароль');
      }
      
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

```