import React from 'react';
import './App.css';
import ButtonRequirement from './components/ButtonRequirement';
import AnimatedButton from './components/AnimatedButton/AnimatedButton';
import PlaneIcon from './components/AnimatedButton/icons/PlaneIcon';
import TickIcon from './components/AnimatedButton/icons/TickIcon';

const App: React.FC = () => {

  return (
    <div className="app">
      <header className="app-header">
        <h1>Button Animation Challenge</h1>
      </header>

      <main className="app-content">
        <section className="challenge-description">
          <h2>Challenge Requirements</h2>
          <p>
            Create a reusable button component that replicates the animation shown in the example.
          </p>
        </section>

        <section className="examples-section">
          <h2>Create this button</h2>
          <ButtonRequirement />
        </section>

        <section className="your-solution">
          <h2>Your Solution</h2>
          <p>Implement your animated button component and showcase it below:</p>
          <div className="solution-demo">
            <AnimatedButton
              size="medium"
              loadingIcon={<PlaneIcon size={20} />}
              successIcon={<TickIcon size={20} />}
            />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Button Animation Challenge &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App; 