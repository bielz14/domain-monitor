# 🚀 Domain Monitor (Laravel + React)

## 📌 Опис

Система моніторингу доступності доменів.

Дозволяє:

* додавати домени
* налаштовувати перевірки
* автоматично перевіряти доступність
* зберігати історію
* відстежувати uptime

---

## 🧱 Стек

* Laravel 13
* React (Vite)
* MySQL 8
* Docker + Nginx

---

## 🐳 Запуск через Docker

### Створити файл оточення для Docker


```bash
cp .env.docker.example .env.docker
````

## 🐳 Запуск через Docker

``` bash
docker-compose up -d --build
````

Відкрити:
http://localhost:8080

---

## ⚙️ Команди

### Черги

``` bash
docker-compose exec app php artisan queue:work
````

### Scheduler

``` bash
docker-compose exec app php artisan schedule:work
````

---

## 📂 Основний функціонал

* Авторизація (Sanctum)
* CRUD доменів
* Авто-перевірка
* Історія перевірок
* HTTP статус + response time

---

* для тесту логінтесь під користувачем, що створюється в seeders

---

## 🔁 Як працює перевірка

* Scheduler запускається щохвилини
* вибирає домени
* відправляє Job
* Job робить HTTP запит
* результат зберігається

---

## 🌐 API

### Auth

* POST /api/register
* POST /api/login
* POST /api/logout

### Domains

* GET /api/domains
* POST /api/domains
* PUT /api/domains/{id}
* DELETE /api/domains/{id}
