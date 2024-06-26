import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { version } from 'os';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    id: String!
    author: String
    version:[ver!]!
  }

  type Customer {
    customer_name: String
    books: [Book]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    customers: [Customer]
  }

  enum ver {
  LATEST,
  OLD,
  COMING_SOON,
}
`;

const customers = [
    {
      customer_name: 'Ram',
      books: ['786']
    },
    {
        customer_name: 'Shyam',
        books: ['199','786']
    },
  ];


const books = [
    {
      id:'199',
      title: 'Wow',
      author: 'Kate',
      version: ['LATEST','OLD']
    },
    {
      id:'786',
      title: 'City of Glass',
      author: 'Paul',
      version: ['COMING_SOON']
    },
  ];

  // Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      customers: () => customers,
    },

    Customer: {
        books(parent) {
            return [books.filter(book => book.id === parent.id)];
        }
    }
  };


  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);