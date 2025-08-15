import '@ant-design/v5-patch-for-react-19';
import { AppProvider } from './AppContext';
import GamePage from './game/page';

export default function Home() {
  return (
    <AppProvider>
      <GamePage />
    </AppProvider>
  );
}