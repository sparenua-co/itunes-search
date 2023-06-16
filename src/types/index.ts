 export interface ITunesItem {
  artistName: string;
  trackName: string;
  artworkUrl100: string;
  trackId: number;
  }
  
  export interface SearchState {
    items: ITunesItem[];
    loading: boolean;
    error: null | string;
  }
  