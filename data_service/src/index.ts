import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import { userPackageDefinition, getUser, addUser, updateUser, deleteUser } from './grpc/user.grpc.js';

const userProto = grpc.loadPackageDefinition(userPackageDefinition) as any




const server = new grpc.Server();

server.addService(userProto.user.UserService.service, {
    AddUser: addUser,
    GetUser: getUser,
    UpdateUser: updateUser,
    DeleteUser: deleteUser
});

server.bindAsync(
    `127.0.0.1:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error("Server error:", error);
            return;
        }
        console.log(`gRPC server listening on port ${port}`);
    }
);