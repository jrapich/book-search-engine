const typeDefs = `
    type Book {
        _id: ID!
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me(_id: String, username: String): User 
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        login(username: String!, password: String!): Auth
        saveBook(
            authors: String!,
            description: String!,
            bookId: String!,
            image: String!,
            link: String!,
            title: String!
        ): User
        deleteBook(bookId: String!): User
    }
`;

module.exports = typeDefs;