import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateTimerForm, TimerFormData } from './validation';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('validateTimerForm', () => {
  let validData: TimerFormData;

  beforeEach(() => {
    validData = {
      title: 'My Timer',
      description: 'Test timer',
      hours: 1,
      minutes: 30,
      seconds: 45,
    };
    vi.clearAllMocks();
  });

  it('should return true for valid input', () => {
    expect(validateTimerForm(validData)).toBe(true);
  });

  it('should fail if title is empty', () => {
    validData.title = '';
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('should fail if title is longer than 50 characters', () => {
    validData.title = 'A'.repeat(51);
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
  });

  it('should fail if time values are negative', () => {
    validData.hours = -1;
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should fail if minutes exceed 59', () => {
    validData.minutes = 60;
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('should fail if seconds exceed 59', () => {
    validData.seconds = 60;
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('should fail if total time is zero', () => {
    validData.hours = 0;
    validData.minutes = 0;
    validData.seconds = 0;
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Please set a time greater than 0');
  });

  it('should fail if total time exceeds 24 hours', () => {
    validData.hours = 25;
    expect(validateTimerForm(validData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
  });
});
