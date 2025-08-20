import { useState } from 'react'

type TodoFormProps = {
  onAdd: (input: string) => void
}

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [input, setInput] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd(input)
    
    setInput('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  )
}

export default TodoForm 