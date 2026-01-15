import { useState, useMemo } from 'react';


function useTaskFilter(tasks, initialFilter = 'all') {
  const [filter, setFilter] = useState(initialFilter);

  // useMemo prevents recalculation on every render
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'completed') return task.done;
      if (filter === 'pending') return !task.done;
      return true;
    });
  }, [tasks, filter]);

  // Return everything the component needs
  return {
    filter,
    setFilter,
    filteredTasks
  };
}

export default useTaskFilter;

