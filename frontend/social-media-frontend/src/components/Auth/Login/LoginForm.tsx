import React, { useState } from "react";

function LoginForm(props: any) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");

    // function handleSubmit(event: any) {
    //     event.preventDefault();
    //     // alert(username + password);
    //     props.updateUser({ username, password });
    // }

    async function handleSubmit(event: any) {
        event.preventDefault();
        let result = await props.login(formData);
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
        </form>
    );
}

export default LoginForm;