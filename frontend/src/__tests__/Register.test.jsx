import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { expect, test, vi, beforeAll, afterEach, afterAll } from "vitest";
import Register from "../pages/Register";
import { setupServer } from "msw/node";
import { http } from "msw";

// Mock API response
const server = setupServer(
    http.post("http://localhost:3000/auth/register", async ({ request }) => {
      const { username, password, nric, first_name, last_name, address, gender } = await request.json();
      if (username === "testuser" && password === "password123" && nric === "S1234567A" && first_name === "John" && last_name === "Doe" && address === "123 Main St" && gender === "M") {
        return new Response(JSON.stringify({ token: "fakeToken" }), {
          status: 200,
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

test("renders the registration form", () => {
  render(<Register setAuth={vi.fn()} />);
  // Ensure the heading is present
  expect(
    screen.getByRole("heading", { name: /Register/i })
  ).toBeInTheDocument();
  // Check if all the fields are rendered

  expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter NRIC/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter First Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter Last Name/i)).toBeInTheDocument();
  const dobInput = screen.getByLabelText("Date of Birth");
  expect(dobInput).toBeInTheDocument();

  // Check if the input field has the correct type and is required
  expect(dobInput).toHaveAttribute("type", "date");
  expect(dobInput).toBeRequired();

  expect(screen.getByPlaceholderText(/Enter Address/i)).toBeInTheDocument();
  const genderSelect = screen.getByLabelText("Gender");
  expect(genderSelect).toBeInTheDocument();

  // Check if all options are rendered
  expect(
    screen.getByRole("option", { name: "Select Gender" })
  ).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Male" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Female" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Register/i })).toBeEnabled();

  // check link to login
  expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
});

test("user can fill in the form", () => {
  render(<Register setAuth={vi.fn()} />);

  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: "password123" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter NRIC/i), { target: { value: "S1234567A" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter first name/i), { target: { value: "John" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter last name/i), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter address/i), { target: { value: "123 Main St" } });
  fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: "M" } });

  expect(screen.getByPlaceholderText(/Enter username/i).value).toBe("testuser");
  expect(screen.getByPlaceholderText(/Enter password/i).value).toBe("password123");
  expect(screen.getByPlaceholderText(/Enter NRIC/i).value).toBe("S1234567A");
  expect(screen.getByPlaceholderText(/Enter first name/i).value).toBe("John");
  expect(screen.getByPlaceholderText(/Enter last name/i).value).toBe("Doe");
  expect(screen.getByLabelText(/Date of Birth/i).value).toBe("2000-01-01");
  expect(screen.getByPlaceholderText(/Enter address/i).value).toBe("123 Main St");
  expect(screen.getByLabelText(/Gender/i).value).toBe("M");
});

test("submit the form with valid data and shows success message", async () => {
  const toastSuccessMock = vi.fn();
  toast.success = toastSuccessMock;
  const mockSetAuth = vi.fn();
  render(<Register setAuth={mockSetAuth} />);

  // Fill in the form fields with valid data
  fireEvent.change(screen.getByPlaceholderText(/Enter username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: "password123" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter NRIC/i), { target: { value: "S1234567A" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter first name/i), { target: { value: "John" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter last name/i), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "2000-01-01" } });
  fireEvent.change(screen.getByPlaceholderText(/Enter address/i), { target: { value: "123 Main St" } });
  fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: "M" } });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /Register/i }));

  // Wait for successful response
  await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith(true));
  expect(toastSuccessMock).toHaveBeenCalledWith("Registration successful");
});

test("field validation: ensure all fields are required", () => {
  render(<Register setAuth={vi.fn()} />);

  // Check for form validation (you can simulate validation checks for empty fields)
  expect(screen.getByPlaceholderText(/Username/i)).toBeRequired();
  expect(screen.getByPlaceholderText(/Password/i)).toBeRequired();
  expect(screen.getByPlaceholderText(/NRIC/i)).toBeRequired();
  expect(screen.getByPlaceholderText(/First Name/i)).toBeRequired();
  expect(screen.getByPlaceholderText(/Last Name/i)).toBeRequired();
  expect(screen.getByLabelText(/Date of Birth/i)).toBeRequired();
  expect(screen.getByPlaceholderText(/Address/i)).toBeRequired();
  expect(screen.getByLabelText(/Gender/i)).toBeRequired();
});
