import { z } from "zod";

/* export const createRoomSchema = z
   .object({
     id: z.string().startsWith("r").min(2),
     name: z.string().max(10).min(3),
     price: z.number().min(0),
     seatsTotal: z.number().min(0),
     seatsFree: z.number().min(0),
    hasAC: z.boolean(),
   })
   .strict();

  export type CreateRoomInput = z.infer<typeof createRoomSchema>; */

/*RoomType: 
  id            
  propertyId    
  name          
  pricePerMonth 
  seatCapacity  
  hasAC         
  isAvailable   
  createdAt  
*/ 
export const createRoomTypeSchema = z
  .object({
    name: z.string().max(120).min(3),
    pricePerMonth: z.number().positive(),
    seatCapacity: z.number().int().positive(),
    hasAC: z.boolean().default(false),
    isAvailable:z.boolean().default(true),
  })
  .strict();

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export const updateRoomTypeSchema = createRoomTypeSchema.partial();
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;

/*Room: 
  id          
  roomTypeId  
  roomLabel   
  isAvailable 
  createdAt   
*/
export const createRoomSchema = z
.object({
   roomLabel: z.string().min(1).max(100),
   isAvailable: z.boolean().default(true),
  })
  .strict();

export type CreateRoomInput =z.infer<typeof createRoomSchema>;
export const updateRoomSchema = createRoomSchema.partial();
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
