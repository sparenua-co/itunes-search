import { Provider } from 'react-redux';
import store from './redux/store';
import Search from './components/Search/Search';

function App() {
  return (
    <Provider store={store}>
      <Search />
    </Provider>
  );
}

export default App;
