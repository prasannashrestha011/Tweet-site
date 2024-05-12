import { useContext } from 'react';
import { TodoContext } from '../context/todocontext';

export default function TodoHooks() {
    return useContext(TodoContext);
}
