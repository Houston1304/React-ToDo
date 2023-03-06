import { React, useEffect, useState } from "react";

function saveToDo(array) {
  const list = JSON.stringify(array);
  localStorage.setItem("todo", list);
}

function getToDo() {
  const savedList = localStorage.getItem("todo");
  const savedArray = JSON.parse(savedList);
  return savedArray;
}

const ItemTodo = ({ id, task, status, changeTodo, deleteTodo }) => {
  const check = status === "done";
  const [checked, setChecked] = useState(check);

  const getInputCheck = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const status = checked ? "done" : "todo";
    changeTodo(id, status);
  }, [checked]);

  const checkedStyle = {
    backgroundColor: "orange",
  };

  return (
    <div className="item" style={checked ? checkedStyle : null}>
      <input
        defaultChecked={checked}
        onChange={getInputCheck}
        className="itemCheck"
        type="checkbox"
        id={id}
      />
      <label htmlFor={id} className="checkLabel">
        {task}
      </label>
      <div onClick={() => deleteTodo(id)} id="button" className="closeButton">
        ✕
      </div>
    </div>
  );
};

const Form = ({ priority, addTodo }) => {
  const [inputValue, setInputValue] = useState("");

  const nameOfClass = priority === "high" ? "addHighCheck" : "addCheck";

  const getInputValue = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const minLength = 2;
    if (inputValue.length <= minLength) return;
    addTodo({
      id: String(Date.now()),
      task: inputValue,
      priority,
      status: "todo",
    });
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="createItem">
      <input
        onChange={getInputValue}
        className={nameOfClass}
        type="item-text"
        placeholder={`Добавить важное дело`}
        id="input_high"
        value={inputValue}
      />
      <button type="submit" className="plusButton">
        +
      </button>
    </form>
  );
};

const BlockTodo = ({
  title,
  priority,
  addTodo,
  todos,
  changeTodo,
  deleteTodo,
}) => {
  const todosPriority = todos.filter((item) => item.priority === priority);
  const todosStatusTodo = todosPriority.filter(
    (item) => item.status === "todo"
  );
  const todosStatusDone = todosPriority.filter(
    (item) => item.status === "done"
  );

  return (
    <div>
      <div className="title">{title}</div>
      <div className="new-item">
        <Form addTodo={addTodo} priority={priority} />
      </div>
      <div className="list-high">
        {todosStatusTodo.map(({ id, task, status }) => (
          <ItemTodo
            key={id}
            id={id}
            task={task}
            status={status}
            changeTodo={changeTodo}
            deleteTodo={deleteTodo}
          />
        ))}
        {todosStatusDone.map(({ id, task, status }) => (
          <ItemTodo
            key={id}
            id={id}
            task={task}
            status={status}
            changeTodo={changeTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [todos, saveToDo] = useState(getToDo() || []);

  const addTodo = (todo) => {
    saveToDo([...todos, todo]);
    localStorage.setItem("todo", JSON.stringify([...todos, todo]));
  };

  const changeTodo = (id, status) => {
    saveToDo(
      todos.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteTodo = (id) => {
    saveToDo(todos.filter((item) => item.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="interface">
      <BlockTodo
        deleteTodo={deleteTodo}
        changeTodo={changeTodo}
        addTodo={addTodo}
        todos={todos}
        title="Высокий приоритет"
        priority="high"
      />
      <BlockTodo
        deleteTodo={deleteTodo}
        changeTodo={changeTodo}
        addTodo={addTodo}
        todos={todos}
        title="Низкий приоритет"
        priority="low"
      />
    </div>
  );
}
export default App;
