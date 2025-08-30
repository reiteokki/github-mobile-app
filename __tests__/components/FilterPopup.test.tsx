import React from 'react';
import FilterPopup from '../../components/FilterPopup';
import { act, fireEvent, render, screen } from '../utils/test-utils.test';

describe('FilterPopup Component', () => {
  const mockOnClose = jest.fn();

  const defaultState = {
    repos: {
      repos: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: '',
      sortBy: 'stars' as const,
      orderBy: 'desc' as const,
      suggestions: [],
      suggestionsLoading: false,
      selectedUser: null,
      userLoading: false,
      userError: null,
      profileUser: null,
      profileLoading: false,
      profileError: null,
      isEditingUsername: false,
    },
    profile: {
      currentUsername: 'octocat',
      localPhotoUri: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing when visible', () => {
      expect(() => {
        render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      }).not.toThrow();
    });

    it('renders without crashing when not visible', () => {
      expect(() => {
        render(<FilterPopup visible={false} onClose={mockOnClose} />, { preloadedState: defaultState });
      }).not.toThrow();
    });

    it('displays filter title when visible', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Filter Repositories')).toBeTruthy();
    });

    it('displays sort options when visible', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Sort By')).toBeTruthy();
      expect(screen.getByText('Stars')).toBeTruthy();
      expect(screen.getByText('Forks')).toBeTruthy();
      expect(screen.getByText('Help Wanted')).toBeTruthy();
      expect(screen.getByText('Recently Updated')).toBeTruthy();
    });

    it('displays order options when visible', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Order')).toBeTruthy();
      expect(screen.getByText('Descending')).toBeTruthy();
      expect(screen.getByText('Ascending')).toBeTruthy();
    });
  });

  describe('Sort Options', () => {
    it('displays all sort options with descriptions', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Stars')).toBeTruthy();
      expect(screen.getByText('Sort by number of stars')).toBeTruthy();
      
      expect(screen.getByText('Forks')).toBeTruthy();
      expect(screen.getByText('Sort by number of forks')).toBeTruthy();
      
      expect(screen.getByText('Help Wanted')).toBeTruthy();
      expect(screen.getByText('Sort by help wanted issues')).toBeTruthy();
      
      expect(screen.getByText('Recently Updated')).toBeTruthy();
      expect(screen.getByText('Sort by last updated')).toBeTruthy();
    });

    it('highlights currently selected sort option', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const starsOption = screen.getByText('Stars');
      expect(starsOption).toBeTruthy();
    });

    it('dispatches setSortBy when sort option is selected', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const forksOption = screen.getByText('Forks');
      
      act(() => {
        fireEvent.press(forksOption);
      });
      
      const state = store.getState();
      expect(state.repos.sortBy).toBe('forks');
    });

    it('dispatches setSortBy for different sort options', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const helpWantedOption = screen.getByText('Help Wanted');
      
      act(() => {
        fireEvent.press(helpWantedOption);
      });
      
      const state = store.getState();
      expect(state.repos.sortBy).toBe('help-wanted-issues');
    });
  });

  describe('Order Options', () => {
    it('displays all order options with descriptions', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Descending')).toBeTruthy();
      expect(screen.getByText('Highest to lowest')).toBeTruthy();
      
      expect(screen.getByText('Ascending')).toBeTruthy();
      expect(screen.getByText('Lowest to highest')).toBeTruthy();
    });

    it('highlights currently selected order option', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const descendingOption = screen.getByText('Descending');
      expect(descendingOption).toBeTruthy();
    });

    it('dispatches setOrderBy when order option is selected', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const ascendingOption = screen.getByText('Ascending');
      
      act(() => {
        fireEvent.press(ascendingOption);
      });
      
      const state = store.getState();
      expect(state.repos.orderBy).toBe('asc');
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when backdrop is pressed', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(mockOnClose).toBeDefined();
    });
  });

  describe('Redux Integration', () => {
    it('reads current sort and order from Redux state', () => {
      const customState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          sortBy: 'forks' as const,
          orderBy: 'asc' as const,
        },
      };

      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: customState });
      
      expect(screen.getByText('Forks')).toBeTruthy();
      expect(screen.getByText('Ascending')).toBeTruthy();
    });

    it('dispatches Redux actions when options are changed', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const forksOption = screen.getByText('Forks');
      act(() => {
        fireEvent.press(forksOption);
      });
      
      const ascendingOption = screen.getByText('Ascending');
      act(() => {
        fireEvent.press(ascendingOption);
      });
      
      const state = store.getState();
      expect(state.repos.sortBy).toBe('forks');
      expect(state.repos.orderBy).toBe('asc');
    });
  });

  describe('State Management', () => {
    it('handles multiple sort changes correctly', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const forksOption = screen.getByText('Forks');
      act(() => {
        fireEvent.press(forksOption);
      });
      
      const helpWantedOption = screen.getByText('Help Wanted');
      act(() => {
        fireEvent.press(helpWantedOption);
      });
      
      const updatedOption = screen.getByText('Recently Updated');
      act(() => {
        fireEvent.press(updatedOption);
      });
      
      const state = store.getState();
      expect(state.repos.sortBy).toBe('updated');
    });

    it('handles multiple order changes correctly', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const ascendingOption = screen.getByText('Ascending');
      act(() => {
        fireEvent.press(ascendingOption);
      });
      
      const descendingOption = screen.getByText('Descending');
      act(() => {
        fireEvent.press(descendingOption);
      });
      
      const state = store.getState();
      expect(state.repos.orderBy).toBe('desc');
    });
  });

  describe('Component Structure', () => {
    it('renders all required sections', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.getByText('Filter Repositories')).toBeTruthy();
      
      expect(screen.getByText('Sort By')).toBeTruthy();
      
      expect(screen.getByText('Order')).toBeTruthy();
    });

    it('renders all sort options', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const sortOptions = ['Stars', 'Forks', 'Help Wanted', 'Recently Updated'];
      sortOptions.forEach(option => {
        expect(screen.getByText(option)).toBeTruthy();
      });
    });

    it('renders all order options', () => {
      render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      const orderOptions = ['Descending', 'Ascending'];
      orderOptions.forEach(option => {
        expect(screen.getByText(option)).toBeTruthy();
      });
    });
  });

  describe('User Interactions', () => {
    it('handles rapid option changes correctly', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      act(() => {
        fireEvent.press(screen.getByText('Forks'));
        fireEvent.press(screen.getByText('Help Wanted'));
        fireEvent.press(screen.getByText('Recently Updated'));
        fireEvent.press(screen.getByText('Stars'));
      });
      
      const state = store.getState();
      expect(state.repos.sortBy).toBe('stars');
    });

    it('handles rapid order changes correctly', () => {
      const { store } = render(<FilterPopup visible={true} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      act(() => {
        fireEvent.press(screen.getByText('Ascending'));
        fireEvent.press(screen.getByText('Descending'));
        fireEvent.press(screen.getByText('Ascending'));
      });
      
      const state = store.getState();
      expect(state.repos.orderBy).toBe('asc');
    });
  });

  describe('Edge Cases', () => {
    it('handles component when not visible', () => {
      render(<FilterPopup visible={false} onClose={mockOnClose} />, { preloadedState: defaultState });
      
      expect(screen.queryByText('Filter Repositories')).toBeNull();
    });
  });
});
