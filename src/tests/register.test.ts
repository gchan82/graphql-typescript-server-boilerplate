import { request } from 'graphql-request';

import { host } from './constants';
import { User } from '../entity/User';
import { createTypeormConn } from '../utils/createTypeormConn';

beforeAll(async () => {
  await createTypeormConn();
})

const email = "bob2@bob.com";
const password = "jalksdf";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test('Register user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1); /*only 1 user in db with this email*/
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password); /*hashed password should not equal plain text password*/
});