import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.jsx";

export default function Dashboard() {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/domains");
                setDomains(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const total = domains.length;
    const upCount = domains.filter((d) => d.checks?.[0]?.status === "up").length;
    const downCount = domains.filter((d) => d.checks?.[0]?.status === "down").length;

    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <div><strong>Всього доменів:</strong> {total}</div>
                <div><strong>UP:</strong> {upCount}</div>
                <div><strong>DOWN:</strong> {downCount}</div>
            </div>

            {loading ? (
                <div style={{ marginTop: 20 }}>Завантаження...</div>
            ) : (
                <table border="1" cellPadding="10" style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>Домен</th>
                        <th>Статус</th>
                        <th>Остання перевірка</th>
                        <th>Детальніше</th>
                    </tr>
                    </thead>
                    <tbody>
                    {domains.map((domain) => {
                        const lastCheck = domain.checks?.[0];
                        return (
                            <tr key={domain.id}>
                                <td>{domain.url}</td>
                                <td style={{ color: lastCheck?.status === "up" ? "green" : "red" }}>
                                    {lastCheck?.status?.toUpperCase() || "—"}
                                </td>
                                <td>{lastCheck?.checked_at || "—"}</td>
                                <td>
                                    <Link to={`/domains/${domain.id}`}>Відкрити</Link>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
