import * as SparkPost from 'sparkpost';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, email: string) => {

  const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirmed Email',
      html: `<html>
      <body>
      <p>
      Testing SparkPost - the world\'s most awesomest email service!
      <a href="${url}">confirm email</a>
      </p>
      </body>
      </html>`
    },
    recipients: [
      { address: 'recipient' }
    ]
  });
  console.log(response);
};
