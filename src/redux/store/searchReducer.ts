import { SearchAction } from '../actions/searchActions';
import { ITunesItem } from '../../types';

interface SearchState {
  items: ITunesItem[];
  loading: boolean;
  error: string | null;
  noMatch: boolean; 
}

const initialState: SearchState = {
  items: [],
  loading: false,
  error: null,
  noMatch: false,  
};

export const searchReducer = (state = initialState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, loading: true, error: null, noMatch: false };
    case 'SEARCH_SUCCESS':
      return { ...state, loading: false, items: action.payload, noMatch: false };  
    case 'SEARCH_FAIL':
      return { ...state, loading: false, error: action.payload, noMatch: false }; 
    case 'SEARCH_NO_MATCH': 
      return { ...state, loading: false, noMatch: true };  
    default:
      return state;
  }
};

export default searchReducer;
