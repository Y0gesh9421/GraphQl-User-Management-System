const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid/v4');
const {
    DataStore
  } = require('notarealdb');
  const store = new DataStore('./data');
  

const typeDefs = gql`

  type Member {
    id: ID! 
    name: String
    address: String
    mobNo: Int
    role: String 
  }
  
  type Mutation {
    addMember(name: String!, address: String, mobNo: Int, role: String):Member
    delMember(id: ID!): DeleteResponse
    updMember(id: ID!,address: String, mobNo: Int, role: String):[Member]
  }

  type DeleteResponse {
    ok: Boolean!
  } 

   type Query{
    orgMember: [Member]
   }`;

  const orgMembers = [];
  const newMember = member => {
    const id = uuid();
    return orgMembers[id] = {...member,id}
  }

  const resolvers = {
    Query: {
      orgMember: () => {
        const user = store.collection('users').list();
        return user;
      }
      
    },  
     Mutation:{
        addMember:(parent,arg) => {
            const data = newMember(arg)
            return data
        },

        delMember:(parent,{id}) => {
            const ok = Boolean(orgMembers[id]);
            delete orgMembers[id];
    
            return { ok };
        },

        updMember:(parent,member) => {
          let members = store.collection('users');
          members.update({
            id: member.id,
            role:member.role
          })
          return store.collection('users').list();
        }

     }
   }
  

  const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`); 
});