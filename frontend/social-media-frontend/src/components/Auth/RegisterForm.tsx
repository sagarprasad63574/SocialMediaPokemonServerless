import React, { useState } from "react";
import Alert from "../common/Alert";

function RegisterForm(props: any) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    async function handleSubmit(event: any) {
        event.preventDefault();
        let result = await props.register(formData);
        if (!result.success) setFormErrors(result.errors)
    }

    function handleChange(event: any) {
        const { name, value } = event.target;
        setFormData(data => ({ ...data, [name]: value }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>First name</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <button type="submit"> Submit </button>
            {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null
            }
        </form>

    );
}

export default RegisterForm;