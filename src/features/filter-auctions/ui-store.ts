import { create } from 'zustand';

interface FiltersPanelState {
  isOpen: boolean;
  toggle: () => void;
}

/**
 * Чисто клиентский UI-state, который сознательно не кладём в URL/React Query:
 * видимость панели фильтров не является частью "адресуемого" состояния страницы.
 */
export const useFiltersPanelStore = create<FiltersPanelState>((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
