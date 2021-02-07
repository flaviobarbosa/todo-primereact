import React, { useState } from 'react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const App = () => {
  const [todo, setTodo] = useState({ title: '', done: false });
  const [todos, setTodos] = useState([
    { title: 'todo1', done: false },
    { title: 'todo2', done: false },
    { title: 'todo3', done: false },
  ]);

  return (
    <div className='p-grid p-dir-col'>
      <div
        className='p-col p-shadow-2 p-text-uppercase p-d-flex p-ai-center p-jc-center p-mb-3'
        style={{ height: '4rem' }}>
        My TODOs
      </div>
      <div className='p-col'>
        <div className='p-d-flex p-ai-center p-jc-center p-mb-4'>
          <div className='p-mr-2'>
            <InputText
              type='text'
              value={todo.title}
              onchange={(e) => setTodo({ title: e.target.value, done: false })}
            />
          </div>
          <Button label='Save' />
        </div>
        <div className='p-d-flex p-flex-column p-ai-center p-jc-center'>
          {todos.map((todo) => (
            <div
              className='p-shadow-1 p-p-2 p-d-flex p-jc-between'
              style={{ width: '500px', height: '3rem' }}>
              <span>{todo.title}</span>
              <Button icon='pi pi-check' className='p-button-rounded p-button-text ' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
