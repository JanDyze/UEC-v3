import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Text } from './components/ui/Text';
import { styles } from './styles/global';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import clsx from 'clsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-bg">
        <nav className="bg-primary">
          <div className={clsx(styles.layout.container, 'flex justify-between items-center')}>
            <Text variant="h3" className="text-primary-contrast">
              UEC Canubing
            </Text>
            <div className="space-x-6">
              <Link 
                to="/" 
                className="text-primary-contrast hover:opacity-80 transition-opacity"
              >
                Home
              </Link>
              <Link 
                to="/members" 
                className="text-primary-contrast hover:opacity-80 transition-opacity"
              >
                Members
              </Link>
              <Link 
                to="/attendance" 
                className="text-primary-contrast hover:opacity-80 transition-opacity"
              >
                Attendance
              </Link>
            </div>
          </div>
        </nav>

        <main className={clsx(styles.layout.container, 'py-8')}>
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4 text-primary">
                    Welcome to UEC Canubing
                  </h1>
                  <p className="text-lg max-w-2xl mx-auto text-neutral-text-secondary">
                    Manage your church community with our simple and efficient system.
                  </p>
                </div>
              } 
            />
            <Route path="/members" element={<Members />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;