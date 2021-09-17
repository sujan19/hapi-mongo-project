import * as Hapi from '@hapi/hapi';
import { Server, ServerRoute } from '@hapi/hapi';
import { connect } from './common';
import { authController, studentController, teacherController } from './controllers';
import { validateBasic, validateJWT } from './auth';

const init = async () => {
    const server: Server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    connect().then(() => {
        console.log("Mongo DB connected successfully");
    })

    //Load a plugin to use
    await server.register(require('hapi-auth-jwt2'));
    await server.register(require('@hapi/basic'));

    //Basic authentication to validate Users
    server.auth.strategy('simple', 'basic', { validate: validateBasic() });
    server.auth.strategy('jwt', 'jwt', {
        key: 'secret',
        validate: validateJWT()
    });

    //for JWT authentication in every route use default('jwt'), just use auth:false in their options to skip JWT auth for that particular route
    // server.auth.default('jwt')

    server.route([
        ...studentController(),
        ...teacherController(),
        ...authController()
    ] as Array<ServerRoute>)
    // server.route(studentController());
    // server.route(teacherController());

    await server.start().then();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();