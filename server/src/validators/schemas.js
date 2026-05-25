import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const authSchemas = {
  signup: z.object({
    body: z.object({
      name: z.string().min(2).max(80),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["admin", "member"]).optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  profile: z.object({
    body: z.object({
      name: z.string().min(2).max(80).optional(),
      jobTitle: z.string().max(100).optional(),
      department: z.string().max(100).optional(),
      avatar: z.string().url().or(z.literal("")).optional(),
      preferences: z
        .object({
          theme: z.enum(["dark", "light"]).optional(),
          notifications: z.boolean().optional()
        })
        .optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  })
};

export const userSchemas = {
  invite: z.object({
    body: z.object({
      name: z.string().min(2).max(80),
      email: z.string().email(),
      role: z.enum(["admin", "member"]).default("member"),
      jobTitle: z.string().max(100).optional(),
      department: z.string().max(100).optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  updateRole: z.object({
    body: z.object({
      role: z.enum(["admin", "member"]),
      status: z.enum(["active", "invited", "inactive"]).optional()
    }),
    params: z.object({
      id: objectId
    }),
    query: z.object({}).optional()
  })
};

export const projectSchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(2).max(120),
      description: z.string().max(1200).optional(),
      status: z.enum(["planning", "active", "on-hold", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.coerce.date(),
      startDate: z.coerce.date().optional(),
      members: z.array(objectId).optional(),
      tags: z.array(z.string().min(1).max(30)).optional(),
      color: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  update: z.object({
    params: z.object({
      id: objectId
    }),
    body: z.object({
      name: z.string().min(2).max(120).optional(),
      description: z.string().max(1200).optional(),
      status: z.enum(["planning", "active", "on-hold", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.coerce.date().optional(),
      startDate: z.coerce.date().optional(),
      members: z.array(objectId).optional(),
      tags: z.array(z.string().min(1).max(30)).optional(),
      color: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional()
    }),
    query: z.object({}).optional()
  })
};

export const taskSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(2).max(160),
      description: z.string().max(2000).optional(),
      project: objectId,
      assignee: objectId,
      status: z.enum(["todo", "in-progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.coerce.date(),
      labels: z.array(z.string().min(1).max(30)).optional(),
      subtasks: z
        .array(
          z.object({
            title: z.string().min(1).max(120),
            done: z.boolean().optional()
          })
        )
        .optional()
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional()
  }),
  update: z.object({
    params: z.object({
      id: objectId
    }),
    body: z.object({
      title: z.string().min(2).max(160).optional(),
      description: z.string().max(2000).optional(),
      project: objectId.optional(),
      assignee: objectId.optional(),
      status: z.enum(["todo", "in-progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.coerce.date().optional(),
      labels: z.array(z.string().min(1).max(30)).optional(),
      subtasks: z
        .array(
          z.object({
            _id: objectId.optional(),
            title: z.string().min(1).max(120),
            done: z.boolean().optional()
          })
        )
        .optional(),
      position: z.number().optional()
    }),
    query: z.object({}).optional()
  }),
  comment: z.object({
    params: z.object({
      id: objectId
    }),
    body: z.object({
      message: z.string().min(1).max(1000)
    }),
    query: z.object({}).optional()
  })
};
