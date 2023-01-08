const html = ({ email }) => {
  return `
<body>
    <p>Hello there!</p>
    <p>You have generated your API and Secrete key</p>
    <p>Use this key for all API interactions.</p>
    <p>In case you need any assistance, just hit reply.</p>
    <p>Cheers,<br />${process.env.EMAIL_FROM}</p>
</body>
`;
};

const text = ({ email }) => {
  return `
Hello there!

You have generated your API and Secrete key

Use this key for all API interactions.

In case you need any assistance, just hit reply.

Cheers,
${process.env.EMAIL_FROM}
`;
};

export { html, text };
