import { render, screen } from '@testing-library/react'
import React from 'react'

function DummyButton() {
  return React.createElement('button', null, 'Click me')
}

describe('DummyButton', () => {
  it('renders button text', () => {
    render(React.createElement(DummyButton))
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
