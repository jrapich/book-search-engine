const {User, Book} = require('../models');
const {authMiddleware, signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { user, params }) =>  {
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
        createUser: async (parent, {username, email, password}) => {
            const user = await User.create({
              username:username,
              email:email,
              password:password,
            });

            if (!user) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne( { email: email });
            if (!user) {
              throw AuthenticationError;
            }
        
            const correctPw = await user.isCorrectPassword(password);
        
            if (!correctPw) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return ({ token, user });
        },

        saveBook: async (parent, {body}, context) => {
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              console.log(err);
              throw AuthenticationError;
            }
        },
        
        deleteBook: async (parent, {params}, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
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