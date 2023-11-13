import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        token
        user {
            _id
            username
        }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation saveBook($content: BookArrayInput!) {
    saveBook(content: $content){
        savedBooks
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
        savedBooks
    }
  }
`;