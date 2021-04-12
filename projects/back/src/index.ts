import User from './entity/User';
import { createConnection } from 'typeorm';
import Server from './Server';

createConnection()
  .then(async (connection) => {
    // const server = new Server();
    // await server.start();

    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;

    const userRepository = connection.getRepository(User);
    await userRepository.save(user);
  })
  .catch((error) => console.log(error));
