/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  onInputChange: () => void;
}

export const TempTodo = ({ todo, onInputChange }: Props) => (
  <div data-cy="todo" className={cn('todo', { completed: todo.completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={onInputChange}
      />
    </label>

    {todo.title ? (
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
    ) : (
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>
    )}

    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
