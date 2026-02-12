'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/lib/types';

const HISTORY_KEY = 'studySmartHistory';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      setHistory([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prevHistory) => {
      const newHistoryItem: HistoryItem = {
        ...item,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 50); // Keep last 50 items
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save history to localStorage', error);
      }
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history from localStorage', error);
    }
  }, []);

  return { history, addHistoryItem, clearHistory, isLoaded };
}
