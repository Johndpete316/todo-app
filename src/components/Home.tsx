import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth, createTodo, updateTodo, deleteTodo, getTodos } from '../firebase'
import '../styles/home.css'
import { Todo } from '../models/Todos'


const Home: React.FC = () => {

    const interval = 5000; // 5 seconds

    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState<string>('');

    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return
        if (!user) navigate('/')
        if(error) navigate('/')
    }, [user, loading, error, navigate])


    // create logic for react todo

    useEffect(() => {
        let timerId: NodeJS.Timeout;
      
        const fetchTodos = () => {
          if (user) {
            getTodos(user.uid).then((todos) => {
              if (!todos) return;
              const todosMapped: Todo[] = todos.map((docData: any) => {
                return {
                  id: docData.id,
                  text: docData.text,
                  completed: docData.completed,
                  createdAt: docData.createdAt.toDate(),
                } as Todo;
              });
              setTodos(todosMapped);
            });
          }
        };
      
        const startInterval = () => {
          timerId = setInterval(() => {
            fetchTodos();
          }, interval);
        };
      
        fetchTodos(); // Fetch todos initially
        startInterval(); // Start fetching todos at regular intervals
      
        return () => {
          clearInterval(timerId); // Clean up the interval when the component unmounts
        };
      }, [user, interval]);

    const handleCheckboxChange = (id: string) => {

        if(!user) navigate('/');
        if(!user) return;

        let updatedCompletedStatus = false;

        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    updatedCompletedStatus = !todo.completed;
                    return { ...todo, completed: updatedCompletedStatus };
                } else {
                    return todo;
                }
            })
        );

        updateTodo(id, updatedCompletedStatus, user.uid);
    };

    const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoText(e.target.value);
    };

    const handleNewTodoSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if(!user) navigate('/');
        if(!user) return;

        if (e.key === 'Enter' && newTodoText.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: newTodoText.trim(),
                completed: false,
                createdAt: new Date()
            };
            setTodos([...todos, newTodo]);
            createTodo(newTodo, user.uid)
            setNewTodoText('');
        }
    };

    const handleDeleteTodo = (id: string) => {

        if(!user) navigate('/');
        if(!user) return;

        setTodos(todos.filter((todo) => todo.id !== id));
        deleteTodo(id, user.uid);
    };

    // date

    function formatRelativeDate(date: Date) {
        
        const now = new Date();
        const todoDate = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - todoDate.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInSeconds / 3600);

    
        if (diffInHours < 1) {
            return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
        } else {
            return todoDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    }

    const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="home">
            <h3> //todos 

                <span className="date"> 🗓️ {today}</span>
            </h3>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        onClick={() => handleCheckboxChange(todo.id)}
                    >
                        <input type="checkbox" checked={todo.completed} readOnly />
                        {todo.text}
                        <span className='date-text'>
                            {formatRelativeDate(todo.createdAt)}
                        </span>
                        <span
                            className="trash-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTodo(todo.id);
                            }}
                        > { /* end span */}
                            🗑️
                        </span>
                    </li>
                ))}
                <li className="new-todo">
                    <input
                        type="text"
                        value={newTodoText}
                        onChange={handleNewTodoChange}
                        onKeyDown={handleNewTodoSubmit}
                        placeholder="Add item..."
                    />
                </li>
            </ul>
        </div>
    )
}

export default Home