// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//     imports: [
//         ClientsModule.register([
//             {
//                 name: 'REDIS_SERVICE',
//                 transport: Transport.REDIS,
//                 options: {
//                     url: 'redis://localhost:6379', // Replace with your Redis URL
//                 },
//             },
//         ]),
//     ],
//     exports: [ClientsModule],
// })
// //export class RedisModule { }