import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const NEW_TODO = { id: '', title: '', done: false };

const App = () => {
  const [todo, setTodo] = useState(NEW_TODO);
  const [todos, setTodos] = useState([]);

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

  return (
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
            <span>ALL DONE!</span>
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
                    <Button
                      icon='pi pi-check'
                      className='p-button-rounded p-button-text p-my-auto'
                      onClick={() => markAsComplete(todo)}
                    />
                  </div>
                ))}
            </>
          )}
          <div className='p-mt-4' style={{ width: '70%' }}>
            {todos.filter((todo) => todo.done === true).length === 0 ? null : (
              <>
                <span className='p-text-italic p-text-uppercase'>done</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
