// Run against an empty disposable migrated database, never production.
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import router from '../src/routes/developer.routes';
async function main(){
 assert.equal(process.env.NODE_ENV, 'test', 'Run only against a disposable test database');
 const create=(username:string,role='player')=>prisma.user.create({data:{username,email:username+'@test',role,profile:{create:{cpuProgression:{create:{cpuKey:'min',wins:2}}}},oauthAccounts:{create:{provider:'42',providerUserId:username}}}});
 const dev=await create('skyforge','developer');const victim=await create('victim');const other=await create('other');
 await prisma.playerFriendship.create({data:{requesterPlayerId:other.id,receiverPlayerId:victim.id,status:'accepted'}});
 await prisma.pvpMatch.create({data:{p1PlayerId:other.id,p2PlayerId:victim.id,winnerPlayerId:victim.id,status:'completed',startedAt:new Date()}});
 await prisma.playerMatchRecord.create({data:{matchId:'fixture',userId:victim.id,mode:'pvp',result:'win',startedAt:new Date(),endedAt:new Date(),durationSeconds:10}});
 const app=express();app.use(express.json(),cookieParser());app.use('/developer',router);
 const server=app.listen(0);await new Promise<void>(r=>server.on('listening',r));
 const url=`http://127.0.0.1:${(server.address() as any).port}/developer/users/`;
 const cookie=(id:string)=>'token='+jwt.sign({userId:id,tokenVersion:0},process.env.JWT_SECRET!);
 const del=(id:string,name:string,actor?:string)=>fetch(url+id,{method:'DELETE',headers:{'Content-Type':'application/json',...(actor?{Cookie:cookie(actor)}:{})},body:JSON.stringify({username:name})});
 try{
  assert.equal((await del(victim.id,'victim')).status,401);
  assert.equal((await del(victim.id,'victim',other.id)).status,403);
  assert.equal((await del(dev.id,'skyforge',dev.id)).status,403);
  assert.equal((await del(victim.id,'wrong',dev.id)).status,409);
  assert.equal(await prisma.user.count(),3);
  assert.equal((await del(victim.id,'victim',dev.id)).status,204);
  assert.equal(await prisma.user.count(),2);assert.equal(await prisma.playerFriendship.count(),0);assert.equal(await prisma.playerMatchRecord.count(),0);
  assert.equal(await prisma.oAuthAccount.count({where:{userId:victim.id}}),0);
  assert.equal((await prisma.pvpMatch.findFirstOrThrow()).p2PlayerId,null);
  assert.equal((await del(other.id,'other',victim.id)).status,401);
  assert.equal((await del(victim.id,'victim',dev.id)).status,404);
  console.log('PASS developer authorization, protected account, confirmation, cascades, opponent history, revoked access, missing account');
 }finally{server.close();await prisma.$disconnect();}
}main().catch(e=>{console.error(e);process.exitCode=1});
