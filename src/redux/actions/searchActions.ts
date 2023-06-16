import axios from 'axios'; 
import { ITunesItem } from '../types';
import { AppThunk } from "../store";

interface SearchStartAction {
  type: 'SEARCH_START';
}

interface SearchSuccessAction {
  type: 'SEARCH_SUCCESS';
  payload: ITunesItem[];
}

interface SearchFailAction {
  type: 'SEARCH_FAIL';
  payload: string;
}

interface SearchNoMatchAction {
  type: 'SEARCH_NO_MATCH';
}

export type SearchAction = SearchStartAction | SearchSuccessAction | SearchFailAction | SearchNoMatchAction;

export const startSearch = (query: string): AppThunk => async dispatch => {
    dispatch({ type: 'SEARCH_START' });

  try {
    const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}`);
    const data = response.data.results;
    if(data.length === 0) {
      dispatch({ type: 'SEARCH_NO_MATCH' });
    } else {
      dispatch({ type: 'SEARCH_SUCCESS', payload: data });
    }
  } catch (err) {
    if (err instanceof Error) {
      dispatch({ type: 'SEARCH_FAIL', payload: err.message });
    } else {
      dispatch({ type: 'SEARCH_FAIL', payload: "An unknown error occurred" });
    }
  }
};
