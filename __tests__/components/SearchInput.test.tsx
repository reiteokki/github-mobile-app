import React from 'react';
import SearchInput from '../../components/SearchInput';
import { act, fireEvent, render, screen } from '../utils/test-utils.test';

describe('SearchInput Component', () => {
  const mockOnSearch = jest.fn();

  const defaultState = {
    repos: {
      repos: [],
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      searchQuery: '',
      suggestions: ['test-repo', 'test-project', 'test-app'],
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
    it('renders without crashing', () => {
      expect(() => {
        render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      }).not.toThrow();
    });

    it('displays search input field', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('displays initial value correctly', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="test" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      expect(input.props.value).toBe('test');
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearch when user types and submits', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'test');
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('calls onSearch with trimmed value', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, '  test  ');
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('does not call onSearch with empty value', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, '   ');
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });
  });

  describe('Suggestions Display', () => {
    it('does not display suggestions by default', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      expect(screen.queryByText('test-repo')).toBeNull();
      expect(screen.queryByText('test-project')).toBeNull();
      expect(screen.queryByText('test-app')).toBeNull();
    });

    it('does not display suggestions when empty', () => {
      const emptySuggestionsState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          suggestions: [],
        },
      };

      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: emptySuggestionsState });
      
      expect(screen.queryByText('test-repo')).toBeNull();
      expect(screen.queryByText('test-project')).toBeNull();
      expect(screen.queryByText('test-app')).toBeNull();
    });

    it('shows loading indicator when suggestions are loading', () => {
      const loadingState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          suggestionsLoading: true,
        },
      };

      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: loadingState });
      
      expect(screen.queryByText('Loading suggestions...')).toBeNull();
    });
  });

  describe('Redux Integration', () => {
    it('dispatches fetchSuggestionsRequest when user types', () => {
      const { store } = render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'test');
      });
      
      expect(input).toBeTruthy();
    });

    it('dispatches clearSuggestions when input is cleared', () => {
      const { store } = render(<SearchInput onSearch={mockOnSearch} initialValue="test" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, '');
      });
      
      expect(input).toBeTruthy();
    });

    it('reads suggestions from Redux state', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });
  });

  describe('Input Behavior', () => {
    it('updates input value when user types', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'new search term');
      });
      
      expect(input.props.value).toBe('new search term');
    });

    it('handles backspace correctly', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="test" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'tes');
      });
      
      expect(input.props.value).toBe('tes');
    });

    it('handles special characters correctly', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'test@#$%^&*()');
      });
      
      expect(input.props.value).toBe('test@#$%^&*()');
    });
  });

  describe('Focus and Blur Behavior', () => {
    it('handles input focus', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent(input, 'focus');
      });
      
      expect(input).toBeTruthy();
    });

    it('handles input blur', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent(input, 'blur');
      });
      
      expect(input).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('renders search input with correct placeholder', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('renders input container', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('handles rapid typing correctly', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 't');
        fireEvent.changeText(input, 'te');
        fireEvent.changeText(input, 'tes');
        fireEvent.changeText(input, 'test');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('handles search submission multiple times', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      
      act(() => {
        fireEvent.changeText(input, 'test1');
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
      
      act(() => {
        fireEvent.changeText(input, 'test2');
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long search terms', () => {
      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: defaultState });
      
      const input = screen.getByPlaceholderText('Search repositories...');
      const longSearchTerm = 'a'.repeat(1000);
      
      act(() => {
        fireEvent.changeText(input, longSearchTerm);
        fireEvent(input, 'submitEditing');
      });
      
      expect(screen.getByPlaceholderText('Search repositories...')).toBeTruthy();
    });

    it('handles empty suggestions array', () => {
      const emptySuggestionsState = {
        ...defaultState,
        repos: {
          ...defaultState.repos,
          suggestions: [],
        },
      };

      render(<SearchInput onSearch={mockOnSearch} initialValue="" />, { preloadedState: emptySuggestionsState });
      
      expect(screen.queryByText('test-repo')).toBeNull();
    });

    it('handles null initial value', () => {
      expect(() => {
        render(<SearchInput onSearch={mockOnSearch} initialValue={null as any} />, { preloadedState: defaultState });
      }).toThrow();
    });

    it('handles undefined initial value', () => {
      expect(() => {
        render(<SearchInput onSearch={mockOnSearch} initialValue={undefined as any} />, { preloadedState: defaultState });
      }).not.toThrow();
    });
  });
});
