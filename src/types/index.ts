import { OrderTable, OrderProducts, Product } from "@prisma/client";

export type OrderItem =Pick<Product,'id'|'name'|'price'>&{
    quantity: number
    subtotal: number
}

export type OrderWithProducts = OrderTable &{
    orderProducts: (OrderProducts & {
        product:Product
    })[]
}