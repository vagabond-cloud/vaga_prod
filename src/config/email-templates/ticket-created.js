const html = ({ email }) => {
    return `
<body>
    <p>Hello there!</p>
    <p>A ticket has been created.</p>
    <p>You can view the details in your Deal Dashboard.</p>
    <p>In case you need any assistance, just hit reply.</p>
    <p>Cheers,<br />${process.env.EMAIL_FROM}</p>
</body>
`;
};

const text = ({ email }) => {
    return `
Hello there!

A ticket has been created.

You can view the details in your Deal Dashboard.

In case you need any assistance, just hit reply.

Cheers,
${process.env.EMAIL_FROM}
`;
};

export { html, text };
