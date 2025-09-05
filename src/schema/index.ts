// src/schema.ts
import { z } from "zod"

// ✅ Enums reflejando Prisma
export const OrderStatusEnum = z.enum([
  "pendiente",
  "en_preparacion",
  "listo_para_entregar",
  "entregado",
])

export const PaymentStatusEnum = z.enum([
  "pendiente",
  "pagado",
])

export const PaymentMethodEnum = z.enum([
  "efectivo",
  "mercadopago",
  "transferencia",
])

export const UserRoleEnum = z.enum([
  "client",
  "waiter",
  "admin",
])

// ✅ Category
export const CategorySchema = z.object({
  name: z.string().trim().min(1, { message: "El nombre de la categoría no puede ir vacío" }),
  slug: z.string().trim().min(1, { message: "El slug no puede ir vacío" }),
})

// ✅ Product
export const ProductSchema = z.object({
  name: z.string().trim().min(1, { message: "El nombre del producto no puede ir vacío" }),
  price: z.coerce.number().min(1, { message: "Precio no válido" }),
  categoryId: z.coerce.number().min(1, { message: "La categoría es obligatoria" }),
  image: z.string().min(1, { message: "La imagen es obligatoria" }),
})

// ✅ User
export const UserSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Email inválido" }),
  role: UserRoleEnum,
})

// ✅ OrderProduct (pivot)
export const OrderProductSchema = z.object({
  productId: z.coerce.number().min(1, { message: "Producto inválido" }),
  quantity: z.coerce.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
})

// ✅ Order
export const OrderSchema = z.object({
  name: z.string().optional(),
  total: z.coerce.number().min(1, { message: "Total inválido" }),
  orderProducts: z.array(OrderProductSchema).min(1, { message: "Debe haber al menos un producto en la orden" }),
  status: OrderStatusEnum.default("pendiente"),
  tableId: z.string().optional(),
  userId: z.coerce.number().optional(),
  paymentStatus: PaymentStatusEnum.default("pendiente"),
  paymentMethod: PaymentMethodEnum.optional(),
  deliveryAddress: z.string().optional(),
  deliveryComment: z.string().optional(),
  ticketGenerated: z.boolean().default(false),
  paymentProof: z.string().optional(),
})

// ✅ OrderId (para endpoints tipo /orders/:id)
export const OrderIdSchema = z.object({
  orderId: z.coerce.number().min(1, { message: "ID inválido" }),
})

// ✅ Search (para buscador)
export const SearchSchema = z.object({
  search: z.string().trim().min(1, { message: "La búsqueda no puede ir vacía" }),
})
