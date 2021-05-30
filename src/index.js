import { createStore } from 'redux';
import "./index.css";

const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const TODOS_LS = "toDos";

const loadedToDos = localStorage.getItem(TODOS_LS) ? JSON.parse(localStorage.getItem(TODOS_LS)) : [];

const reducer = (state = [], action) => {
  switch (action.type) {
    case "add":
      return [{ text: action.text, id: Date.now(), completed: false }, ...state]
    case "delete":
      return state.filter(item => item.id !== action.id)
    case "complete":
      return state.map((item) => {
        if (item.id === action.id) {
          return {
            ...item,
            completed: !item.completed
          }
        }
        return item;
      })
    default:
      return state
  }
}

let store = createStore(reducer, loadedToDos);

const handleComplete = e => {
  const id = parseInt(e.target.parentNode.id);
  store.dispatch({ type: "complete", id });
}

const handleDelete = e => {
  const id = parseInt(e.target.parentNode.id);
  store.dispatch({ type: "delete", id })
}

const paintTodos = () => {
  const toDos = store.getState();
  ul.innerHTML = "";
  toDos.forEach(toDo => {
    const li = document.createElement("li");
    const completeBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    li.innerText = toDo.text;
    li.id = toDo.id;
    completeBtn.innerText = "Completed";
    completeBtn.addEventListener("click", handleComplete);
    if (toDo.completed) {
      li.className = "completed";
    };
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", handleDelete);
    ul.appendChild(li);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
  });
}

const saveLocalStorage = () => {
  const toDos = store.getState();
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

store.subscribe(() => {
  saveLocalStorage();
  paintTodos();
});

const handleSubmit = e => {
  e.preventDefault();
  const toDo = input.value;
  input.value="";
  store.dispatch({ type: "add", text: toDo })
}

paintTodos();
form.addEventListener("submit", handleSubmit);
