import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { getCsrfCookie } from "../api.jsx";

export default function Login({ onLogin }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setErrors({});
            setMessage("");

            await getCsrfCookie();
            await axios.post("/login", form);

            if (onLogin) {
                await onLogin();
            }

            navigate("/", { replace: true });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setMessage("Не вдалося виконати вхід.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
            <h1>Вхід</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        style={{ width: "100%" }}
                    />
                    {errors.email && (
                        <div style={{ color: "red", marginTop: 4 }}>
                            {errors.email[0]}
                        </div>
                    )}
                </div>

                <div>
                    <label>Пароль</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="******"
                        style={{ width: "100%" }}
                    />
                    {errors.password && (
                        <div style={{ color: "red", marginTop: 4 }}>
                            {errors.password[0]}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Виконується вхід..." : "Увійти"}
                </button>

                {message && <div style={{ color: "red" }}>{message}</div>}
            </form>

            <p style={{ marginTop: 16 }}>
                Немає акаунта? <Link to="/register">Зареєструватися</Link>
            </p>
        </div>
    );
}
