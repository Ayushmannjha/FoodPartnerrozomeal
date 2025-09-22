import { AppRouter } from './router/AppRouter';
import { LanguageProvider } from "./components/layout/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}