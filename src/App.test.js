import { render, screen } from '@testing-library/react';
import App from './App';

test('shows WELCOME', () => {
  render(<App />);
  const linkElement = screen.getByText(/WELCOME/i);
  expect(linkElement).toBeInTheDocument();
});
