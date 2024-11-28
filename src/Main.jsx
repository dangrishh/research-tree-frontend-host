import ReactDOM from 'react-dom/client';  // Update import to 'react-dom/client'
import App from './App';
import './index.css';
import './Dashboards/AdviserDashboard/MyAdvisee/adviserckeditor.css';
import './Dashboards/StudentDashboard/MyManuscript/ckeditor.css';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
