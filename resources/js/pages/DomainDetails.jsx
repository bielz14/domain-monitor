import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "../api.jsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function DomainDetails() {
    const { id } = useParams();

    const [domain, setDomain] = useState(null);
    const [checks, setChecks] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        status: "",
        date_from: "",
        date_to: "",
    });

    const loadDomain = async () => {
        const res = await api.get(`/domains/${id}`);
        setDomain(res.data);
    };

    const loadChecks = async (page = 1, appliedFilters = filters) => {
        const params = {
            page,
            per_page: 20,
        };

        if (appliedFilters.status) params.status = appliedFilters.status;
        if (appliedFilters.date_from) params.date_from = appliedFilters.date_from;
        if (appliedFilters.date_to) params.date_to = appliedFilters.date_to;

        const res = await api.get(`/domains/${id}/checks`, { params });
        setChecks(res.data.data);
        setMeta(res.data);
    };

    const initialize = async () => {
        try {
            setLoading(true);
            await Promise.all([loadDomain(), loadChecks()]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initialize();
    }, [id]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = async (e) => {
        e.preventDefault();
        await loadChecks(1, filters);
    };

    const resetFilters = async () => {
        const next = { status: "", date_from: "", date_to: "" };
        setFilters(next);
        await loadChecks(1, next);
    };

    const chartData = useMemo(() => {
        const normalized = [...checks].reverse();

        return {
            labels: normalized.map((item) =>
                new Date(item.checked_at).toLocaleString()
            ),
            datasets: [
                {
                    label: "Uptime",
                    data: normalized.map((item) => (item.status === "up" ? 1 : 0)),
                    tension: 0.2,
                },
            ],
        };
    }, [checks]);

    const uptimeStats = useMemo(() => {
        if (!checks.length) {
            return { total: 0, up: 0, down: 0, uptimePercent: 0 };
        }

        const total = checks.length;
        const up = checks.filter((item) => item.status === "up").length;
        const down = total - up;
        const uptimePercent = ((up / total) * 100).toFixed(2);

        return { total, up, down, uptimePercent };
    }, [checks]);

    if (loading) return <div style={{ padding: 20 }}>Завантаження...</div>;
    if (!domain) return <div style={{ padding: 20 }}>Домен не знайдено</div>;

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
                <Link to="/domains">← Назад до списку</Link>
            </div>

            <h1>Domain Details</h1>

            <div style={{ marginBottom: 24 }}>
                <p><strong>URL:</strong> {domain.url}</p>
                <p><strong>Метод:</strong> {domain.method}</p>
                <p><strong>Інтервал:</strong> {domain.check_interval} сек</p>
                <p><strong>Таймаут:</strong> {domain.timeout} сек</p>
                <p><strong>Остання перевірка:</strong> {domain.last_checked_at || "—"}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
                <h2>Статистика uptime</h2>
                <p><strong>Всього перевірок:</strong> {uptimeStats.total}</p>
                <p><strong>UP:</strong> {uptimeStats.up}</p>
                <p><strong>DOWN:</strong> {uptimeStats.down}</p>
                <p><strong>Uptime %:</strong> {uptimeStats.uptimePercent}%</p>
            </div>

            <div style={{ maxWidth: 1000, marginBottom: 32 }}>
                <h2>Графік uptime</h2>
                <Line data={chartData} />
            </div>

            <div style={{ marginBottom: 24 }}>
                <h2>Фільтри історії</h2>

                <form onSubmit={applyFilters} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
                    <div>
                        <label>Статус</label>
                        <br />
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">Усі</option>
                            <option value="up">UP</option>
                            <option value="down">DOWN</option>
                        </select>
                    </div>

                    <div>
                        <label>Дата від</label>
                        <br />
                        <input
                            type="date"
                            name="date_from"
                            value={filters.date_from}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div>
                        <label>Дата до</label>
                        <br />
                        <input
                            type="date"
                            name="date_to"
                            value={filters.date_to}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <button type="submit">Застосувати</button>
                    <button type="button" onClick={resetFilters}>Скинути</button>
                </form>
            </div>

            <div>
                <h2>Історія перевірок</h2>

                <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>HTTP Code</th>
                        <th>Response Time</th>
                        <th>Помилка</th>
                    </tr>
                    </thead>
                    <tbody>
                    {checks.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                Немає даних
                            </td>
                        </tr>
                    ) : (
                        checks.map((check) => (
                            <tr key={check.id}>
                                <td>{check.checked_at}</td>
                                <td>
                                        <span style={{ color: check.status === "up" ? "green" : "red" }}>
                                            {check.status.toUpperCase()}
                                        </span>
                                </td>
                                <td>{check.http_code ?? "—"}</td>
                                <td>{check.response_time ?? "—"} ms</td>
                                <td>{check.error_message || "—"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                {meta && (
                    <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                            disabled={!meta.prev_page_url}
                            onClick={() => loadChecks(meta.current_page - 1)}
                        >
                            Назад
                        </button>

                        <span>
                            Сторінка {meta.current_page} з {meta.last_page}
                        </span>

                        <button
                            disabled={!meta.next_page_url}
                            onClick={() => loadChecks(meta.current_page + 1)}
                        >
                            Вперед
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
