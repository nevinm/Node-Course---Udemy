const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// Development server property.
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true
}));

app.listen(4000, () => {
	console.log('Server started at 4000');
});
