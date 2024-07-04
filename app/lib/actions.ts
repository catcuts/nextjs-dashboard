'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
    // const rawFormData = CreateInvoice.parse({
    //     customerId: formData.get('customerId'),
    //     amount: formData.get('amount'),
    //     status: formData.get('status'),
    //   });
    // 从表单数据中提取、解析、校验创建新发票所需数据
    const rawFormData = CreateInvoice.parse(Object.fromEntries(formData.entries()));

    const { customerId, amount, status } = rawFormData;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // 插入新发票数据
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // 清除缓存并向服务器触发新请求，以便更新发票路由中显示的数据
    revalidatePath('/dashboard/invoices');

    // 重定向到发票列表页面
    redirect('/dashboard/invoices');
}