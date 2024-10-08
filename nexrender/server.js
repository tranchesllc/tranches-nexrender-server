require("dotenv").config();

const server = require("@nexrender/server");

const port = 3050;
const secret = process.env.SECRET;

server.listen(port, secret, () => {
    console.log(`Server listening on port ${port}`);
});
