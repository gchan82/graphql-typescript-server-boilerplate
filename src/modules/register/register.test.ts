import { request } from 'graphql-request';

import { User } from '../../entity/User';
import { startServer } from '../../startServer';
import { AddressInfo } from 'net';
import { emailNotLongEnough, duplicateEmail, invalidEmail, passwordNotLongEnough } from './errorMessages';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "bob8@bob.com";
const password = "alasoioayt";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
  path
  message
  }
}
`;

describe('Register user', async () => {
  it("check for duplicate emails", async () => {
    //make sure we can register a user
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1); /*only 1 user in db with this email*/
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password); /*hashed password should not equal plain text password*/

    //test for duplicate emails
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("check bad email", async () => {
    const response3: any = await request(getHost(), mutation("b", password));
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  //catch bad password
  it("check bad password", async () => {
    const response4: any = await request(getHost(), mutation(email, "b"));
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  //catch bad password and bad email
  it("check bad password and bad email", async () => {
    const response5: any = await request(getHost(), mutation("b1", "b2"));
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
