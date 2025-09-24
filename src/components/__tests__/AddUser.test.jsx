import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddUser from "../AddUser.jsx";
import axios from "axios";

vi.mock("axios"); // prevents real API calls.


describe("AddUser component", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });
    // test fields is present or not.
    it("renders form fields", () => {
        render(<AddUser />);
        expect(screen.getByLabelText(/ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Add User/i })).toBeInTheDocument();
    });

    // test validation in email.
    it("validates email and shows error", async () => {
        render(<AddUser />);

        // Type invalid email
        await userEvent.type(screen.getByLabelText(/Email/i), "Invalid email");

        // Submit the form
        await userEvent.click(screen.getByRole("button", { name: /Add User/i }));

        // Assert the email error is displayed
        expect(await screen.findByText(/email/i)).toBeInTheDocument();
    });


    // This test checks the success case (User added successfully).
    it("submits form successfully", async () => {
        axios.post.mockResolvedValue({ data: { message: "User added successfully" } });
        render(<AddUser />);

        await userEvent.type(screen.getByLabelText(/ID/i), "123");
        await userEvent.type(screen.getByLabelText(/Username/i), "Tuhin");
        await userEvent.type(screen.getByLabelText(/Email/i), "tuhghgin@gmail.com");
        await userEvent.type(screen.getByLabelText(/Age/i), "30");

        await userEvent.click(screen.getByRole("button", { name: /Add User/i }));

        expect(await screen.findByText(/User added successfully/i)).toBeInTheDocument();
    });

});




