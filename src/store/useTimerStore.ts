import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';

const LOCAL_STORAGE_KEY = 'timers';

const loadState = (): Timer[] => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : [];
  } catch (error) {
    console.error('Error loading timers from localStorage', error);
    return [];
  }
};

const saveState = (state: Timer[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving timers to localStorage', error);
  }
};

interface TimerState {
  timers: Timer[];
}

const initialState: TimerState = {
  timers: loadState(),
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer: (state, action: PayloadAction<Omit<Timer, 'id' | 'createdAt'>>) => {
      const newTimer: Timer = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      saveState(state.timers);
    },
    deleteTimer: (state, action: PayloadAction<string>) => {
      state.timers = state.timers.filter(timer => timer.id !== action.payload);
      saveState(state.timers); 
    },
    toggleTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
        saveState(state.timers);
      }
    },
    updateTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer && timer.isRunning) {
        timer.remainingTime -= 1;
        timer.isRunning = timer.remainingTime > 0;
        saveState(state.timers);
      }
    },
    restartTimer: (state, action: PayloadAction<string>) => {
      const timer = state.timers.find(timer => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
        saveState(state.timers);
      }
    },
    editTimer: (state, action: PayloadAction<{ id: string; updates: Partial<Timer> }>) => {
      const timer = state.timers.find(timer => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
        saveState(state.timers);
      }
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };
export const { addTimer, deleteTimer, toggleTimer, updateTimer, restartTimer, editTimer } = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};
