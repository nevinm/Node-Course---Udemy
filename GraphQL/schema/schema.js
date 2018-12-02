const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
} = graphql;
const axios = require('axios');
const URL = (key, id, secondKey) => {
	if(secondKey) {
		return `http://localhost:3000/${key}/${id}/${secondKey}`;
	}
	return `http://localhost:3000/${key}/${id}/`
};

// How to walk a user through to its company.
const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users : {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				console.log(parentValue)
				return axios.get(URL("companies", parentValue.id, "users"))
				.then(resp => resp.data);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(URL("companies", parentValue.companyId)).
				then(resp => resp.data);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		users: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(URL("users", args.id))
					.then(resp => resp.data);
			}
		},
		company: {
			type: CompanyType,
			args: {id: {type: GraphQLString }},
			resolve(parentValue, args) {
				return axios.get(URL("companies", args.id))
				.then(resp => resp.data);
			}
		}
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString },
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post('http://localhost:3000/users', { firstName, age })
				.then(resp => resp.data);
			}
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`)
					.then(resp => resp.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString },
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(resp => resp.data);
			}
		}
	}
})
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation,
});
