import React, { useState } from 'react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const NEW_TODO = { title: '', done: false };

const App = () => {
  const [todo, setTodo] = useState(NEW_TODO);
  const [todos, setTodos] = useState([]);

  const addTodo = (event) => {
    if (event) event.preventDefault();

    const newTotoList = [...todos, todo];
    setTodo(NEW_TODO);
    setTodos(newTotoList);
  };

  return (
    <div className='p-grid p-dir-col'>
      <div
        className='p-col p-shadow-2 p-text-uppercase p-d-flex p-ai-center p-jc-center p-mb-3'
        style={{ height: '4rem' }}>
        My TODOs
      </div>
      <div className='p-col'>
        <form onsubmit={addTodo}>
          <div className='p-d-flex p-ai-center p-jc-center p-mb-4'>
            <div className='p-mr-2'>
              <InputText
                type='text'
                value={todo.title}
                onChange={(e) => setTodo({ title: e.target.value, done: false })}
              />
            </div>
            <Button label='Save' onClick={addTodo} />
          </div>
        </form>
        <div className='p-d-flex p-flex-column p-ai-center p-jc-center'>
          {todos.map((todo) => (
            <div
              key={todo.title}
              className='p-shadow-1 p-d-flex p-jc-between'
              style={{ width: '70%', height: '2.5rem' }}>
              <span className='p-my-auto p-ml-2'>{todo.title}</span>
              <Button icon='pi pi-check' className='p-button-rounded p-button-text p-my-auto' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
