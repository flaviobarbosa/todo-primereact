import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Accordion, AccordionTab } from 'primereact/accordion';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { writeTodo, readTodos, deleteTodo } from './firebaseActions';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const NEW_TODO = { id: '', title: '', done: false };

const App = () => {
  const [user, setUser] = useState(null);
  const [todo, setTodo] = useState(NEW_TODO);
  const [todoToRemove, setTodoToRemove] = useState();
  const [todos, setTodos] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const toast = useRef(null);

  React.useEffect(() => {
    if (user) {
      setTimeout(() => {
        readTodos().then((todos) => setTodos(todos));
      }, 1000);
    }
  }, [user]);

  const addTodo = (event) => {
    if (event) event.preventDefault();

    const _todo = { ...todo, done: false };
    const newTotoList = [...todos, _todo];
    setTodo(NEW_TODO);
    setTodos(newTotoList);

    writeTodo(todo);
  };

  const markAsComplete = (todo) => {
    const indexOldTodo = todos.indexOf(todo);
    const completedTodo = { ...todos[indexOldTodo], done: true, doneAt: new Date() };

    //const newTotoList = todos.filter((t) => t.id !== todo.id);
    //setTodos([...newTotoList, completedTodo]);

    todos.splice(indexOldTodo, 1, completedTodo);
    setTodos([...todos]);
  };

  const removeTodoConfirmation = (todo) => {
    setTodoToRemove(todo);
    setShowRemoveDialog(true);
  };

  const acceptRemoval = () => {
    // const indexTodoToRemove = todos.indexOf(todoToRemove);
    // todos.splice(indexTodoToRemove, 1);

    // setTodos([...todos]);
    setShowRemoveDialog(false);
    console.log(todoToRemove);
    deleteTodo(todoToRemove.id);

    toast.current.show({
      severity: 'success',
      summary: 'TODO successfully removed',
      life: 5000,
    });
  };

  const login = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        var user = result.user;
        return user;
      })
      .catch((error) => {
        alert('Erro no login');
        console.log(error);
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
    } else {
      console.log('no user signed in');
    }
  });

  if (user) {
    return (
      <>
        <Toast ref={toast} />
        <div className='p-grid p-dir-col'>
          <div
            className='p-col p-d-flex p-jc-between p-ai-center p-shadow-2 p-text-uppercase p-mb-3 p-p-4'
            style={{ height: '4rem' }}>
            <img
              alt='user photo'
              style={{ borderRadius: '50%', height: '3rem' }}
              src={user.photoURL}
            />
            <p className='p-text-bold' style={{ fontSize: '2rem' }}>
              My TODOs
            </p>
            <div style={{ cursor: 'pointer', fontSize: '0.8rem' }} onClick={logout}>
              LOGOUT
            </div>
          </div>
          <div className='p-col'>
            <form onSubmit={addTodo}>
              <div className='p-d-flex p-ai-center p-jc-center p-mb-4'>
                <div className='p-mr-2'>
                  <InputText
                    type='text'
                    value={todo.title}
                    onChange={(event) => setTodo({ ...todo, title: event.target.value })}
                  />
                </div>
                <Button label='Save' disabled={todo.title.trim().length === 0} onClick={addTodo} />
              </div>
            </form>
            <div className='p-d-flex p-flex-column p-ai-center p-jc-center'>
              <Accordion multiple activeIndex={[0]} style={{ width: '90vw' }}>
                <AccordionTab header='TODO'>
                  {todos.filter((todo) => todo.done === false).length === 0 ? (
                    <div className='p-text-italic p-text-uppercase p-text-center'>
                      you're all done!
                    </div>
                  ) : (
                    <>
                      {todos
                        .filter((todo) => todo.done === false)
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className='p-shadow-1 p-d-flex p-jc-between p-mb-1'
                            style={{ height: '2.5rem' }}>
                            <span className='p-my-auto p-ml-2'>{todo.title}</span>
                            <div>
                              <Button
                                icon='pi pi-check'
                                className='p-button-rounded p-button-text p-my-auto'
                                onClick={() => markAsComplete(todo)}
                              />
                              <Button
                                icon='pi pi-times'
                                className='p-button-rounded p-button-text p-button-danger p-my-auto'
                                onClick={() => removeTodoConfirmation(todo)}
                              />
                              <ConfirmDialog
                                visible={showRemoveDialog}
                                onHide={() => setShowRemoveDialog(false)}
                                message='Are you sure you want to proceed?'
                                header='Confirmation'
                                icon='pi pi-exclamation-triangle'
                                accept={() => acceptRemoval()}
                                reject={() => setShowRemoveDialog(false)}
                              />
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </AccordionTab>
                <AccordionTab header='DONE'>
                  {todos.filter((todo) => todo.done).length === 0 ? (
                    <div className='p-text-italic p-text-uppercase p-text-center'>
                      nothing done :(
                    </div>
                  ) : (
                    <>
                      {todos
                        .filter((todo) => todo.done)
                        .sort((a, b) => a.doneAt - b.doneAt)
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className='p-shadow-1 p-d-flex p-jc-between p-mb-1'
                            style={{ height: '2.5rem', backgroundColor: '#f8f9fa' }}>
                            <span
                              className='p-my-auto p-ml-2 p-text-light p-text-italic'
                              style={{ textDecoration: 'line-through' }}>
                              {todo.title}
                            </span>
                          </div>
                        ))}
                    </>
                  )}
                </AccordionTab>
              </Accordion>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p>To continue log in with </p>
        <button onClick={login}>Google</button>
      </>
    );
  }
};

export default App;
