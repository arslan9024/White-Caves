import { render, screen } from '@testing-library/react'
import React from 'react'

function DummyButton() {
  return <button>Click me</button>
}

describe('DummyButton', () => {
  it('renders button text', () => {
    render(<DummyButton />)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
