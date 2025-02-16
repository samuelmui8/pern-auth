import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { expect, test, vi, beforeAll, afterEach, afterAll } from "vitest";
import Login from "../pages/Login";
import { setupServer } from "msw/node";
import { http } from "msw";

// Mock API response
const server = setupServer(
  http.post("http://localhost:3000/auth/login", async ({ request }) => {
    const { username, password } = await request.json();

    if (username === "testuser" && password === "password123") {
      return new Response(JSON.stringify({ token: "fakeToken" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (username === "testuser" && password !== "password123") {
      return new Response(JSON.stringify({ message: "Incorrect password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (username !== "testuser") {
      return new Response(JSON.stringify({ message: "Invalid username" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  })
);

// Start the mock server before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close the server after tests
afterAll(() => server.close());

test("renders login form", () => {
  render(<Login setAuth={vi.fn()} />);

  // Ensure the heading is present
  expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

  // Ensure the form labels are present
  expect(screen.getByText(/Username/i)).toBeInTheDocument();
  expect(screen.getByText(/Password/i)).toBeInTheDocument();

  // Ensure the username and password fields exist
  expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();

  // Ensure the login button is present
  expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Login/i })).toBeEnabled();

  // Ensure the register link is present
  expect(screen.getByRole("link", { name: /Register/i })).toBeInTheDocument();
});

test("allows the user to enter login credentials", () => {
  render(<Login setAuth={vi.fn()} />);

  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);

  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  expect(usernameInput.value).toBe("testuser");
  expect(passwordInput.value).toBe("password123");
});

test("shows success message on successful login", async () => {
  const toastSuccessMock = vi.fn();
  toast.success = toastSuccessMock;
  const mockSetAuth = vi.fn();
  render(<Login setAuth={mockSetAuth} />);

  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith(true));
  expect(toastSuccessMock).toHaveBeenCalledWith("Login successful");
});

test("shows error message on invalid username", async () => {
  const toastErrorMock = vi.fn();
  toast.error = toastErrorMock;
  const mockSetAuth = vi.fn();
  render(<Login setAuth={mockSetAuth} />);

  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
    target: { value: "invaliduser" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith(false));
  expect(toastErrorMock).toHaveBeenCalledWith("Invalid username");
});

test("shows error message on wrong password", async () => {
  const toastErrorMock = vi.fn();
  toast.error = toastErrorMock;
  const mockSetAuth = vi.fn();
  render(<Login setAuth={mockSetAuth} />);

  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
    target: { value: "wrongpassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Login/i }));

  await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith(false));
  expect(toastErrorMock).toHaveBeenCalledWith("Incorrect password");
});
