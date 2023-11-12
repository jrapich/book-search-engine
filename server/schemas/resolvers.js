const {User, Book} = require('../models');
const {authMiddleware, signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { user, params }) =>  {
            user = null;
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              });
          
              if (!foundUser) {
                throw AuthenticationError;
              }
          
              return foundUser;
        }
    },
    Mutation: {
        createUser: async (parent, {body}) => {
            const user = await User.create(body);

            if (!user) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, {body}) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
              throw AuthenticationError;
            }
        
            const correctPw = await user.isCorrectPassword(body.password);
        
            if (!correctPw) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return ({ token, user });
        },
        saveBook: async (parent, {user, body}) => {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              console.log(err);
              throw AuthenticationError;
            }
        },
        deleteBook: async (parent, {user, params}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                throw AuthenticationError;
              }
              return updatedUser;
        }
    }
}

module.exports = resolvers;