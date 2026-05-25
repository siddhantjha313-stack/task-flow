# TaskFlow AI API Reference

Base URL:

```text
/api
```

All protected routes require:

```http
Authorization: Bearer <jwt>
```

## Auth

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Create an account. First user becomes admin. |
| POST | `/auth/login` | Public | Login and receive JWT. |
| GET | `/auth/me` | Authenticated | Return current user. |
| PATCH | `/auth/me` | Authenticated | Update profile/preferences. |

## Users

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/users` | Authenticated | List team members with task stats. |
| POST | `/users/invite` | Admin | Create/invite a team member. |
| PATCH | `/users/:id` | Admin | Update role/status. |
| DELETE | `/users/:id` | Admin | Deactivate user. |

## Projects

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/projects/dashboard` | Authenticated | Dashboard metrics, charts, team progress. |
| GET | `/projects` | Authenticated | List accessible projects. |
| POST | `/projects` | Admin | Create project. |
| GET | `/projects/:id` | Authenticated | Project detail and tasks. |
| PATCH | `/projects/:id` | Admin | Update project. |
| DELETE | `/projects/:id` | Admin | Archive project. |

## Tasks

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/tasks` | Authenticated | List tasks. Members receive assigned tasks. |
| POST | `/tasks` | Admin | Create task. |
| GET | `/tasks/:id` | Authenticated | Get task detail. |
| PATCH | `/tasks/:id` | Authenticated | Admin edits any field; members can update assigned task status/subtasks. |
| DELETE | `/tasks/:id` | Admin | Delete task. |
| POST | `/tasks/:id/comments` | Authenticated | Add task comment. |

## Activity

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/activity?limit=30` | Authenticated | Recent project/task/team activity. |
