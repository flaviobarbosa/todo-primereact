import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const writeTodo = (todo) => {
  //   const userId = firebase.auth().currentUser.uid;

  //   var newKey = firebase
  //     .database()
  //     .ref()
  //     .child('users/' + userId)
  //     .push().key;

  //   var updates = {};
  //   updates['users/' + userId + '/' + newKey] = todo;

  //   firebase.database().ref().update(updates);

  const userId = firebase.auth().currentUser.uid;

  let newTodo = firebase
    .database()
    .ref('users/' + userId)
    .push();

  newTodo.set(todo);
};

export const readTodos = () => {
  if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;

    return firebase
      .database()
      .ref('users/' + userId)
      .once('value')
      .then((snapshot) => {
        let todos = [];
        snapshot.forEach((child) => {
          todos.push({
            ...child.val(),
            id: child.key,
          });
        });
        return todos;
      });
  } else {
    console.log('no user logged in');
  }
};

export const deleteTodo = (key) => {
  if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;

    var updates = {};
    updates['users/' + userId + '/' + key] = null;
    firebase.database().ref().update(updates);
  }
};
