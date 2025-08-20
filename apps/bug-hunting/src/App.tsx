import { useState, useMemo } from 'react'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import { Todo, Filter } from './types/todo.types'

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>(Filter.All)

  const addTodo = (text: string) => {
    const newTodo = { text, completed: false, id: Date.now().toString() }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }

  const deleteTodo = (id: string) => {
    const remainingTodos = todos.filter(todo => {
      return todo.id !== id
    })
    setTodos(remainingTodos)
  }

  const filteredTodos = useMemo(() => {
    if (filter === Filter.Active) {
      return todos.filter(todo => !todo.completed)
    } else if (filter === Filter.Completed) {
      return todos.filter(todo => todo.completed)
    }
    return todos
  }, [todos, filter])

  function clearCompleted() {
    const activeTodos = todos.filter(todo => !todo.completed)
    setTodos(activeTodos)
  }

  return (
    <div className="app">
      <h1>Todo App</h1>

      <TodoForm onAdd={addTodo} />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />

      <TodoFilter filter={filter} onClearCompleted={clearCompleted} onFilter={setFilter} />
    </div>
  )
}

export default App
