import React, { useState } from "react";
import Alert from "../common/Alert";

function LoginForm(props: any) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    async function handleSubmit(event: any) {
        event.preventDefault();
        let result = await props.login(formData);
        if (!result.success) setFormErrors(result.errors);
    }

    function handleChange(event: any) {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
            />
            <label>Password</label>
            <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
            />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
            {formErrors.length 
                ? <Alert type="danger" messages={formErrors} />
                : null}
        </form>
    );
}

export default LoginForm;