import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth, createTodo, updateTodo } from '../firebase'
import '../styles/home.css'
import { Todo } from '../models/Todos'


const Home: React.FC = () => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState<string>('');

    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) return
        if (!user) navigate('/')
    }, [user, loading])

    // create logic for react todo

    const handleCheckboxChange = (id: string) => {
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
    
        updateTodo(id, updatedCompletedStatus, user.id);
    };

    const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoText(e.target.value);
    };

    const handleNewTodoSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTodoText.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: newTodoText.trim(),
                completed: false,
            };
            setTodos([...todos, newTodo]);
            createTodo(newTodo, user.uid)
            setNewTodoText('');
        }
    };

    return (
        <div className="home">
            <h3> //todos </h3>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={todo.completed ? 'completed' : ''}
                        onClick={() => handleCheckboxChange(todo.id)}
                    >
                        <input type="checkbox" checked={todo.completed} readOnly />
                        {todo.text}
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