
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Header } from '@/components/layout/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
