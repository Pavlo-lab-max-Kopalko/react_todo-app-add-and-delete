import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { postTodos, USER_ID } from '../api/todos';
import { ErrorMessage, Todo } from '../types/Todo';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | false>>;
  tempTodo: Todo | false;
}

export const FormAddTodo = ({
  onSubmit,
  setTodos,
  setErrorMessage,
  setTempTodo,
  tempTodo,
}: Props) => {
  const [todoText, setTodoText] = useState<string>('');
  // const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // console.log(inputRef);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onSubmit(event);

    const newTodo = {
      completed: false,
      id: 0,
      userId: USER_ID,
      title: todoText.trim(),
    };

    if (todoText.trim() === '') {
      setErrorMessage(ErrorMessage.TITLE);

      setTimeout(() => {
        setErrorMessage(ErrorMessage.DEFAULT);
      }, 3000);

      return;
    }

    setTempTodo(newTodo);

    const addTodo = postTodos(newTodo);

    addTodo
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setTodoText('');
        setTempTodo(false);
      })
      .catch(error => {
        setTempTodo(false);
        // eslint-disable-next-line no-console
        console.error('Помилка при додаванні todo:', error);
        setErrorMessage(ErrorMessage.ADD);
        setTodoText('');

        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      });
  };

  useEffect(() => {
    if (tempTodo && inputRef.current) {
      // console.log('Спроба сфокусувати:', inputRef.current);
    } else {
      // console.log('Не вдалося сфокусувати:', inputRef.current, tempTodo);
      inputRef.current?.focus();
    }
  }, [tempTodo, inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={todoText}
        onChange={handleChange}
        disabled={!!tempTodo}
        ref={inputRef}
      />
    </form>
  );
};
