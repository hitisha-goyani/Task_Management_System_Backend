import Joi from "joi";


const TaskValidation = Joi.object({
  title: Joi.string().min(2).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 200 characters"
  }),

  description: Joi.string().max(1000).optional().messages({
    "string.max": "Description cannot exceed 1000 characters"
  }),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .required()
    .messages({
      "any.only": "Priority must be low, medium, or high",
      "string.empty": "Priority is required",
    }),

  
  status: Joi.string()
    .valid("todo", "in-progress", "completed", "rejected")
    .default("todo") 
    .messages({
      "any.only": "Status must be todo, in-progress, completed, or rejected"
    })
});



const updateTask = Joi.object({
  status: Joi.string()
    .valid("todo", "in-progress", "completed", "rejected")
    .required()
    .messages({
      "any.only": "Status must be todo, in-progress, completed, or rejected",
      "string.empty": "Status is required"
    }),

  rejectMessage: Joi.string().when("status", {
    is: "rejected",
    then: Joi.required().messages({
      "any.required": "Reject message is required when status is rejected",
      "string.empty": "Reject message cannot be empty"
    }),
    otherwise: Joi.optional()
  }),

  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
});

export default { TaskValidation, updateTask };
