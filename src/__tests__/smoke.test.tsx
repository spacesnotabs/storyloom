import { render } from '@testing-library/react'
import App from '../App'

it('renders', () => {
  const { getByText } = render(<App />)
  expect(getByText(/vite \+ react/i)).toBeInTheDocument()
})
