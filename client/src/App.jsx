import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './slices/authSlice';
import { Outlet } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

export default App;
