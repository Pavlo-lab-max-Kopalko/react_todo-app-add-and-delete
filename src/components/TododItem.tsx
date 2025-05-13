/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage, FilteredStatus, Todo } from '../types/Todo';
import { TempTodo } from './TempTodo/TempTodo';
import { deleteTodos } from '../api/todos';

interface Props {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  setCount: (value: number) => void;
  filterValue: FilteredStatus;
  onInputChange: () => void;
  tempTodo: Todo | null;
  setErrorMessage: (value: ErrorMessage) => void;
}

export const TodoItem = (
  { todos,
    setTodos,
    setCount,
    filterValue,
    onInputChange,
    tempTodo,
    setErrorMessage
  }: Props
) => {
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);

  useEffect(() => {
    const incompleteCount = todos.filter(todo => !todo.completed).length;

    setCount(incompleteCount);
  }, [todos, setCount]);

  const filteredTodos = todos.filter(todo => {
    if (filterValue === FilteredStatus.ACTIVE) {
      return !todo.completed;
    }

    if (filterValue === FilteredStatus.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const onDelete = (todoId: number) => {
    setDeletedTodoId((prevIds) => [...prevIds, todoId]);

    const removeTodo = deleteTodos(todoId);

    removeTodo
      .then(() => {
        const exsistedTodos = todos.filter(todo => todo.id !== todoId);

        setTodos(exsistedTodos);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Помилка при видаленні todo:', error);
        setErrorMessage(ErrorMessage.DELETE);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() =>
        setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo item-enter-done', { completed: todo.completed })}
        >
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => (onDelete(todo.id))}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': deletedTodoId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo &&
        <TempTodo
          todo={tempTodo}
          onInputChange={onInputChange}
        />
      }

    </section>
  );
};
