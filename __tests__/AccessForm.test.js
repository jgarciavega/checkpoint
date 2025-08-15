import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessForm from '../src/AccessForm';

describe('AccessForm autofill and submit', () => {
  test('renders with initialData and calls onSubmit when Entrada clicked', () => {
    const initialData = { numeroUnidad: 'ABC-123', conductor: 'Juan Perez', empresa: 'ACME' };
    const mockSubmit = jest.fn();
    render(<AccessForm initialData={initialData} onSubmit={mockSubmit} />);

    // check that inputs are filled
    expect(screen.getByPlaceholderText(/Ej: 1234, ABC-123/i)).toHaveValue('ABC-123');
    expect(screen.getByPlaceholderText(/Nombre completo del conductor/i)).toHaveValue('Juan Perez');
    expect(screen.getByPlaceholderText(/Nombre de la empresa/i)).toHaveValue('ACME');

    // click Entrada
    const btn = screen.getByRole('button', { name: /Entrada/i });
    fireEvent.click(btn);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const calledWith = mockSubmit.mock.calls[0][0];
    expect(calledWith.numeroUnidad).toBe('ABC-123');
    expect(calledWith.conductor).toBe('Juan Perez');
    expect(calledWith.empresa).toBe('ACME');
  });
});
