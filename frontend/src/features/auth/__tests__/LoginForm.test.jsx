import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../components/LoginForm';
import { authAPI } from '../../../api';

vi.mock('../../../api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      }
    };
    authAPI.login.mockResolvedValue(mockResponse);

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  it('displays error message on login failure', async () => {
    const mockError = {
      response: {
        data: { message: 'Invalid credentials' }
      }
    };
    authAPI.login.mockRejectedValue(mockError);

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('shows loading state during form submission', async () => {
    authAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('validates required fields', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
}); 