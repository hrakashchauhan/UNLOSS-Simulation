import {PrismaClient} from '@prisma/client';import bcrypt from 'bcryptjs';
const db=new PrismaClient();const password=process.env.SEED_PASSWORD||'ParcelDemo!2026';
const accounts=[['Maya Seller','seller@unloss.test','+919800000101','SELLER'],['Ravi Delivery','delivery@unloss.test','+919800000202','DELIVERY'],['Anaya Customer','customer@unloss.test','+919800000303','CUSTOMER'],['Dev Delivery','delivery2@unloss.test','+919800000204','DELIVERY'],['Isha Customer','customer2@unloss.test','+919800000304','CUSTOMER']] as const;
for(const [name,email,phone,role] of accounts){await db.user.upsert({where:{email},update:{name,phone,role,passwordHash:await bcrypt.hash(password,12)},create:{name,email,phone,role,passwordHash:await bcrypt.hash(password,12)}})}
console.log(`Development accounts seeded. Shared local-only password: ${password}`);await db.$disconnect();
