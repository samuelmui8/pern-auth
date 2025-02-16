import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import Dashboard from "../pages/Dashboard";
import { beforeAll, afterEach, afterAll, vi, test, expect } from "vitest";
import { toast } from "react-toastify";

// Mock API response for fetching user data
const server = setupServer(
  http.get("http://localhost:3000/dashboard", () => {
    return new Response(
      JSON.stringify({
        nric: "S1234567A",
        first_name: "John",
        last_name: "Doe",
        dob: "1990-01-01T00:00:00.000Z",
        address: "123 Main St",
        gender: "M",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),
  http.post("http://localhost:3000/auth/logout", () => {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
);

// Start the mock server before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close the server after tests
afterAll(() => server.close());

test("renders user data correctly", async () => {
  const mockSetAuth = vi.fn();
  render(<Dashboard setAuth={mockSetAuth} />);

  // Wait for the user data to be loaded
  await waitFor(() =>
    expect(screen.queryByText(/Loading user data.../i)).not.toBeInTheDocument(),
  );

  // Verify that the user data is displayed correctly
  expect(screen.getByText(/NRIC:/i)).toBeInTheDocument();
  expect(screen.getByText("S1234567A")).toBeInTheDocument();

  expect(screen.getByText(/Name:/i)).toBeInTheDocument();
  expect(screen.getByText("John Doe")).toBeInTheDocument();

  expect(screen.getByText(/Date of Birth:/i)).toBeInTheDocument();
  expect(screen.getByText("1990-01-01")).toBeInTheDocument(); // Formatted date

  expect(screen.getByText(/Address:/i)).toBeInTheDocument();
  expect(screen.getByText("123 Main St")).toBeInTheDocument();

  expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
  expect(screen.getByText("Male")).toBeInTheDocument();

  // Verify that the logout button is present
  expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
});

test("shows a loading message while fetching user data", async () => {
  const mockSetAuth = vi.fn();
  render(<Dashboard setAuth={mockSetAuth} />);
  expect(screen.getByText(/Loading user data.../i)).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(/Loading user data.../i)).not.toBeInTheDocument(),
  );
});

test("logs out successfully when the logout button is clicked", async () => {
  const toastSuccessMock = vi.fn();
  toast.success = toastSuccessMock;
  const mockSetAuth = vi.fn();
  render(<Dashboard setAuth={mockSetAuth} />);

  await waitFor(() =>
    expect(screen.queryByText(/Loading user data.../i)).not.toBeInTheDocument(),
  );

  const logoutButton = screen.getByRole("button", { name: /Logout/i });
  fireEvent.click(logoutButton);

  await waitFor(() => {
    expect(mockSetAuth).toHaveBeenCalledWith(false);
    expect(toastSuccessMock).toHaveBeenCalledWith("Logout successful");
  });
});
