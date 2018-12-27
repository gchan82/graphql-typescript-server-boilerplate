// part 11 (9:00) - last position. 

import * as Redis from 'ioredis';
import fetch from 'node-fetch';

import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import { User } from '../entity/User';

let userId = '';
const redis = new Redis();

beforeAll(async () => {
  await createTypeormConn();
  const user = await User.create({
    email: "bob5@bob.com",
    password: "awoinaslidtyao"
  }).save();
  userId = user.id;
});

describe("test createConfirmEmailLink", () => {
test("Make sure it confirms user and clears key in Redis", async () => {
  const redis = new Redis();
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    redis,
  );

  const response = await fetch(url);
  const text = await response.text();
  console.log(text);
  expect(text).toEqual('ok');
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split('/');
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});

test("Sends invalid back if bad id sent", async() => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
  const text = await response.text();
  console.log('invalid');
})
});
