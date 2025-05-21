import React from 'react';
import { GrDocumentUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import './todo.css';

const TodoCards = ({ title, body, id, del, display, updateId, toBeUpdate }) => {
  return (
    <div className="card p-3 shadow-sm d-flex justify-content-between flex-column" style={{ minHeight: '200px' }}>
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>

      <div className='d-flex justify-content-end gap-2'>
        <div className="icon-style" onClick={() => {
          display("block");
          toBeUpdate(updateId);
        }}>
          <GrDocumentUpdate size={20} /> update
        </div>
        <div className="icon-style" onClick={() => del(id)}>
          <AiFillDelete size={22} /> Delete
        </div>
      </div>
    </div>
  );
};

export default TodoCards;
