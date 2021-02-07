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

const NEW_TODO = { id: '', title: '', done: false };

const App = () => {
  const [todo, setTodo] = useState(NEW_TODO);
  const [todoToRemove, setTodoToRemove] = useState();
  const [todos, setTodos] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const toast = useRef(null);

  const addTodo = (event) => {
    if (event) event.preventDefault();

    const _todo = { ...todo, id: uuidv4(), done: false };
    const newTotoList = [...todos, _todo];
    setTodo(NEW_TODO);
    setTodos(newTotoList);
  };

  const markAsComplete = (todo) => {
    const indexOldTodo = todos.indexOf(todo);
    const completedTodo = { ...todos[indexOldTodo], done: true, doneAt: new Date() };

    //const newTotoList = todos.filter((t) => t.id !== todo.id);
    //setTodos([...newTotoList, completedTodo]);

    todos.splice(indexOldTodo, 1, completedTodo);
    setTodos([...todos]);
  };

  const removeTodo = (todo) => {
    setTodoToRemove(todo);
    setShowRemoveDialog(true);
  };

  const acceptRemoval = () => {
    const indexTodoToRemove = todos.indexOf(todoToRemove);
    todos.splice(indexTodoToRemove, 1);

    setTodos([...todos]);

    toast.current.show({
      severity: 'success',
      summary: 'TODO successfully removed',
      life: 5000,
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className='p-grid p-dir-col'>
        <div
          className='p-col p-shadow-2 p-text-uppercase p-d-flex p-ai-center p-jc-center p-mb-3'
          style={{ height: '4rem' }}>
          My TODOs
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
            {todos.filter((todo) => todo.done === false).length === 0 ? (
              <span className='p-text-italic p-text-uppercase'>you're all done!</span>
            ) : (
              <>
                {todos
                  .filter((todo) => todo.done === false)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className='p-shadow-1 p-d-flex p-jc-between p-mb-1'
                      style={{ width: '70%', height: '2.5rem' }}>
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
                          onClick={() => removeTodo(todo)}
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
            <div className='p-mt-4' style={{ width: '70%' }}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
