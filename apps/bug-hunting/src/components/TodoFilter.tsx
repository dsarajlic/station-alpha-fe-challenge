import { Filter } from '../types/todo.types';

type TodoFilterProps = {
  filter: Filter;
  onFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const TodoFilter = ({ filter, onFilter, onClearCompleted }: TodoFilterProps) => {

  const handleFilterChange = (newFilter: Filter) => {
    onFilter(newFilter)
  }
  
  return (
    <div className="todo-filter">
      <div className="filter-buttons">
        <button 
          className={filter === Filter.All ? "active" : ""} 
          onClick={() => handleFilterChange(Filter.All)}
        >
          All
        </button>
        <button 
          className={filter === Filter.Active ? "active" : ""} 
          onClick={() => handleFilterChange(Filter.Active)}
        >
          Active
        </button>
        <button 
          className={filter === Filter.Completed ? "active" : ""} 
          onClick={() => handleFilterChange(Filter.Completed)}
        >
          Completed
        </button>
      </div>
      
      <button 
        className="clear-completed"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </div>
  )
}
export default TodoFilter 